import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import {
	NodeConnectionType,
	NodeOperationError,
	deepCopy
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
			name: 'XmlPlus',
			icon: 'file:xml.svg',
			group: [],
			version: 1,
			description: 'Convert data to and from XML (community node)',
			defaults: {
					name: 'XML Plus',
		},
			inputs: [NodeConnectionType.Main],
			outputs: [NodeConnectionType.Main],
			properties: [{
							displayName: 'Conversion Mode',
							name: 'mode',
							type: 'options',
							options: [{
											name: 'JSON to XML',
											value: 'jsonToXml',
											description: 'Converts data from JSON to XML',
									},
									{
											name: 'XML to JSON',
											value: 'xmlToJson',
											description: 'Converts data from XML to JSON',
									},
							],
							default: 'xmlToJson',
							description: 'The conversion needed for the input data',
					},
					{
							displayName: 'Property Name',
							name: 'dataPropertyName',
							type: 'string',
							default: 'data',
							required: true,
							description: 'Name of the property to that needs to be converted',
					},
					{
							displayName: 'Format',
							name: 'format',
							type: 'boolean',
							default: true,
							description: 'Whether parsed XML is output as a single line XML string or formatted',
							displayOptions: {
									show: {
											mode: ['jsonToXml'],
									}
							}
					},
					{
							displayName: "If your XML is inside a binary file, use the 'Extract from File' node to convert it to text first",
							name: 'xmlNotice',
							type: 'notice',
							default: '',
							displayOptions: {
									show: {
											mode: ['xmlToJson'],
									}
							},
					},
					{
							displayName: 'Validator',
							name: 'validateXml',
							type: 'boolean',
							default: false,
							description: 'Whether to enable or disable the XML validator on the parsed or built XML data',
					},
					...xmlPlusOptions
			]
	};

	async execute(this: IExecuteFunctions): Promise < INodeExecutionData[][] > {
			const items = this.getInputData();
			const mode = this.getNodeParameter('mode', 0) as string;
			const options = this.getNodeParameter('options', 0, {});
			const dataPropertyName = this.getNodeParameter('dataPropertyName', 0);
			const returnData: INodeExecutionData[] = [];
			for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
					try {
							const item = items[itemIndex];

							const validateXml = this.getNodeParameter('validateXml', itemIndex) as boolean;
							const validatorOptions = {
									allowBooleanAttributes: true
							}

							if (mode === 'xmlToJson') {

									if (item.json[dataPropertyName] === undefined) {
											throw new NodeOperationError(
													this.getNode(),
													`Item has no JSON property called "${dataPropertyName}"`, {
															itemIndex
													},
											);
									}
									const xmlString = item.json[dataPropertyName] as string;

									// Conditionally validate incoming XML with options
									if (validateXml) {
											const validation = XMLValidator.validate(xmlString, validatorOptions);
											if (validation !== true) {
													throw new NodeOperationError(this.getNode(), `Invalid XML: ${validation.err.msg}`, {
															itemIndex
													});
											}
									}

									// Parse the XML
									const parser = new XMLParser({
											ignoreAttributes: false,
											...options
									});
									const json = parser.parse(xmlString);
									returnData.push({
											json: deepCopy(json)
									});

							} else if (mode === 'jsonToXml') {
									const format = this.getNodeParameter('format', itemIndex) as boolean;
									const builder = new XMLBuilder({
											ignoreAttributes: false,
											format,
											...options
									});

									// Build XML from JSON
									const xml = builder.build(items[itemIndex].json);

									// Conditionally validate the built XML with options
									if (validateXml) {
											const validation = XMLValidator.validate(xml, validatorOptions);
											if (validation !== true) {
													throw new NodeOperationError(this.getNode(), `Built XML is invalid: ${validation.err.msg}`, {
															itemIndex
													});
											}
									}

									returnData.push({
											json: {
													[dataPropertyName]: xml
											},
											pairedItem: {
													item: itemIndex
											}
									});
							} else {
									throw new NodeOperationError(this.getNode(), `The operation "${mode}" is not supported.`, {
											itemIndex
									});
							}
					} catch (error) {
							if (this.continueOnFail()) {
									returnData.push({
											json: {
													error: (error as Error).message
											},
											pairedItem: {
													item: itemIndex
											}
									});
									continue;
							}
							throw error;
					}
			}

			return [returnData];
	}
}
