import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import {
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';
import {
	XMLParser,
	XMLBuilder,
	XMLValidator
} from 'fast-xml-parser';
import {
	xmlPlusOptions
} from './XmlPlusOptions';

export class XmlPlus implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'XML Plus',
		name: 'xmlPlus',
		description: 'Convert data to and from XML (community node)',
		icon: 'file:XmlPlus.svg',
		group: [],
		version: 1,
		defaults: {
			name: 'XML Plus',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [{
				displayName: 'Operation',
				name: 'operation',
				description: 'The conversion needed for the input data',
				type: 'options',
				default: 'xmlToJson',
				noDataExpression: true,
				options: [{
						name: 'JSON to XML',
						value: 'jsonToXml',
						description: 'Converts data from JSON to XML',
						action: 'Convert JSON to XML',
					},
					{
						name: 'XML to JSON',
						value: 'xmlToJson',
						description: 'Converts data from XML to JSON',
						action: 'Convert XML to JSON',
					},
					{
						name: 'Validate XML',
						value: 'validateOnly',
						description: 'Validates XML without conversion',
						action: 'Validate XML',
					},
				],
			},
			{
				displayName: 'Use Entire JSON',
				name: 'useEntireJson',
				description: "Whether to use the full incoming JSON or the 'Input Property'",
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						operation: ['jsonToXml'],
					},
				},
			},
			{
				displayName: 'Input Property',
				name: 'inputProperty',
				description: 'Name of the property to be converted',
				type: 'string',
				default: 'data',
				required: true,
				requiresDataPath: 'single',
				displayOptions: {
					hide: {
						useEntireJson: [true],
					},
				},
			},
			{
				displayName: 'Output Property',
				name: 'outputProperty',
				description: 'Name of the output property where the converted data will be stored',
				type: 'string',
				default: 'data',
				required: true,
				requiresDataPath: 'single',
			},
			{
				displayName: 'Format XML',
				name: 'format',
				description: 'Whether parsed XML is output as a single-line XML string or formatted using tabs and newlines',
				type: 'boolean',
				default: true,
				displayOptions: {
					show: {
						operation: ['jsonToXml'],
					},
				},
			},
			{
				displayName: 'Validator',
				name: 'validateXml',
				description: 'Whether to enable or disable XML validation on the parsed or built XML data',
				type: 'boolean',
				default: false,
			},
			...xmlPlusOptions,
		],
	};

	async execute(this: IExecuteFunctions): Promise < INodeExecutionData[][] > {
		const items = this.getInputData();
		const operation = this.getNodeParameter('operation', 0) as string;
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const item = items[itemIndex];
				const jsonData = item.json;
				const outputProperty = this.getNodeParameter('outputProperty', itemIndex) as string;
				const validateXml = this.getNodeParameter('validateXml', itemIndex) as boolean;

				function getNestedProperty(obj: any, path: string): any {
					return path.split('.').reduce((acc, key) => acc?.[key], obj);
				}

				// XML to JSON Conversion
				if (operation === 'xmlToJson') {
					const inputProperty = this.getNodeParameter('inputProperty', itemIndex) as string;
					const xmlString = getNestedProperty(jsonData, inputProperty);
					const parserOptions = this.getNodeParameter('parserOptions', itemIndex, {}) as IDataObject;
					const validatorOptions = this.getNodeParameter('validatorOptions', itemIndex, {}) as IDataObject;

					if (xmlString === undefined) {
						throw new NodeOperationError(
							this.getNode(),
							`Item has no JSON property named "${inputProperty}"`, {
								itemIndex
							}
						);
					}

					const parser = new XMLParser({
						ignoreAttributes: false,
						...parserOptions
					});

					const json = parser.parse(xmlString);

					if (validateXml) {
						const validation = XMLValidator.validate(xmlString, validatorOptions);
						if (validation !== true) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid XML: ${validation.err.msg}`, {
									itemIndex
								},
							);
						}
					}

					returnData.push({
						json: {
							[outputProperty]: json,
						},
						pairedItem: {
							item: itemIndex,
						},
					});
				}
				// JSON to XML Conversion
				else if (operation === 'jsonToXml') {
					const parserOptions = this.getNodeParameter('parserOptions', itemIndex, {}) as IDataObject;
					const useEntireJson = this.getNodeParameter('useEntireJson', itemIndex) as boolean;
					const format = this.getNodeParameter('format', itemIndex) as boolean;
					const includeXmlDeclaration = parserOptions?.includeXmlDeclaration as boolean;
					const xmlDeclarationType = parserOptions?.xmlDeclarationType as string;
					const validatorOptions = this.getNodeParameter('validatorOptions', itemIndex, {}) as IDataObject;

					const builder = new XMLBuilder({
						ignoreAttributes: false,
						suppressBooleanAttributes: false,
						format,
						...parserOptions
					});

					let xml;

					if (useEntireJson) {
						xml = builder.build(jsonData);
					} else {
						const inputProperty = this.getNodeParameter('inputProperty', itemIndex) as string;
						xml = builder.build(jsonData[inputProperty]);
					}

					if (validateXml) {
						const validation = XMLValidator.validate(xml, validatorOptions);
						if (validation !== true) {
							throw new NodeOperationError(
								this.getNode(),
								`Built XML is invalid: ${validation.err.msg}`, {
									itemIndex
								},
							);
						}
					}

					if (includeXmlDeclaration) {
						let declaration = '';
						switch (xmlDeclarationType) {
							case 'version11':
								declaration = '<?xml version="1.1" encoding="UTF-8"?>\n';
								break;
							case 'noEncoding':
								declaration = '<?xml version="1.0"?>\n';
								break;
							case 'standard':
							default:
								declaration = '<?xml version="1.0" encoding="UTF-8"?>\n';
						}
						xml = declaration + xml;
					}

					returnData.push({
						json: {
							[outputProperty]: xml,
						},
						pairedItem: {
							item: itemIndex,
						},
					});
				}
				// XML Validation
				else if (operation === 'validateOnly') {
					const inputProperty = this.getNodeParameter('inputProperty', itemIndex) as string;
					const xmlString = getNestedProperty(item.json, inputProperty);
					const validatorOptions = this.getNodeParameter('validatorOptions', itemIndex, {}) as IDataObject;
					const validation = XMLValidator.validate(xmlString, validatorOptions);

					returnData.push({
						json: {
							[outputProperty]: {
								valid: validation === true,
								message: validation === true ? 'XML is valid' : validation.err.msg,
							},
						},
						pairedItem: {
							item: itemIndex
						},
					});
				}

			} catch (error: unknown) {
				if (error instanceof NodeOperationError) {
					throw error;
				}
				throw new NodeOperationError(
					this.getNode(),
					`Unknown error occurred: ${(error as Error).message || error}`, {
						itemIndex
					}
				);
			}
		}

		// Return the processed data
		return [returnData];
	}
}
