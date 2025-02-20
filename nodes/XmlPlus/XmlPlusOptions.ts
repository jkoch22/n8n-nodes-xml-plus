import type {
	INodeProperties
} from 'n8n-workflow';

export const xmlPlusOptions: INodeProperties[] = [
	// ----------------------------------
	//         option:xmlToJson
	// ----------------------------------
	{
			displayName: 'Options',
			name: 'options',
			type: 'collection',
			placeholder: 'Add option',
			displayOptions: {
					show: {
							mode: ['xmlToJson'],
					},
			},
			default: {},
			options: [{
							displayName: 'Allow Boolean Attributes',
							name: 'allowBooleanAttributes',
							type: 'boolean',
							default: false,
							description: "Whether to to allow attributes without value. Once you allow boolean attributes, they are parsed and set to 'true'.",
					},
					{
							displayName: 'Always Create Text Node',
							name: 'alwaysCreateTextNode',
							type: 'boolean',
							default: false,
							description: "Whether to force render a tag with textnode. This always created when Preserve Order is 'true'. Otherwise, it creates a property with the tag name and assigns the value directly.",
					},
					{
							displayName: 'Attribute Name Prefix',
							name: 'attributeNamePrefix',
							type: 'string',
							default: '@_',
							description: 'Whether to prepend some string to each attribute name in order to recognize attributes in the JSON separately',
					},
					{
							displayName: 'Attributes Group Name',
							name: 'attributesGroupName',
							type: 'string',
							default: '',
							description: 'Whether to group all the attributes of a tag under given property name',
					},
					{
							displayName: 'CDATA Prop Name',
							name: 'cdataPropName',
							type: 'string',
							default: '__cdata',
							description: "If 'CDATA Prop Name' is not set to some property name, then CDATA values are merged to tag\'s text value. When 'CDATA Prop Name' is set to some property then text value and CDATA are parsed to different properties.",
					},
					{
							displayName: 'Comment Prop Name',
							name: 'commentPropName',
							type: 'string',
							default: '#comment',
							description: 'Whether to set some property name so that comments are parsed from XML',
					},
					{
							displayName: 'Ignore Attributes',
							name: 'ignoreAttributes',
							type: 'boolean',
							default: false,
							description: "Whether to ignore attributes when parsing. Must be disabled if applying any option that modifies attributes.",
					},
					{
							displayName: 'Ignore Declaration',
							name: 'ignoreDeclaration',
							type: 'boolean',
							default: false,
							description: 'Whether to ignore the declaration when parsing',
					},
					{
							displayName: 'Ignore PI Tags',
							name: 'ignorePiTags',
							type: 'boolean',
							default: true,
							description: 'Whether to ignore processing instruction tags when parsing',
					},
					{
							displayName: 'Parse Attribute Value',
							name: 'parseAttributeValue',
							type: 'boolean',
							default: false,
							description: 'Whether to parse attribute values. Strings with numerical valus will be parsed as numbers and Boolean attributes are always parsed to true. XML Parser doesn\'t give an error if validation is kept off so it\'ll overwrite the value of repeated attributes.',
					},
					{
							displayName: 'Parse Tag Value',
							name: 'parseTagValue',
							type: 'boolean',
							default: true,
							description: 'Whether to parse tag values. Strings with numerical valus will be parsed as numbers and Boolean attributes are always parsed to true. XML Parser doesn\'t give an error if validation is kept off so it\'ll overwrite the value of repeated attributes.',
					},
					{
							displayName: 'Preserve Order',
							name: 'preserveOrder',
							type: 'boolean',
							default: false,
							description: 'Whether to keep the order of tags in the output JSON. It also helps the XML builder to build the similar kind of XML from the JSON without losing information.',
					},
					{
							displayName: 'Process Entities',
							name: 'processEntities',
							type: 'boolean',
							default: true,
							description: 'Whether to process default and DOCTYPE entities. If you don\'t have entities in your XML document then it is recommended to disable it for better performance.',
					},
					{
							displayName: 'Remove Namespace Prefix',
							name: 'removeNSPrefix',
							type: 'boolean',
							default: false,
							description: 'Whether to remove namespace string from tag and attribute names',
					},
					{
							displayName: 'Text Node Name',
							name: 'textNodeName',
							type: 'string',
							default: '#text',
							description: 'A custom key name for storing text inside XML tags',
					},
					{
							displayName: 'Trim Values',
							name: 'trimValues',
							type: 'boolean',
							default: false,
							description: 'Whether to remove surrounding whitespace from tag or attribute value. If the tag value consists of whitespace only and Trim Values is disabled then value will not be parsed even if Parse Tag Value is enabled. Similarly, if Trim Values is enabled and Parse Tag Value is disabled then surrounding whitespace will be removed.',
					}
			]
	},

	// ----------------------------------
	//         option:jsonToXml
	// ----------------------------------
	{
			displayName: 'Options',
			name: 'options',
			type: 'collection',
			placeholder: 'Add option',
			displayOptions: {
					show: {
							mode: ['jsonToXml'],
					},
			},
			default: {},
			options: [
					{
							displayName: 'Attribute Name Prefix',
							name: 'attributeNamePrefix',
							type: 'string',
							default: '@_',
							description: 'To recognize attribute properties in the JSON so that they can be trimmed',
					},
					{
							displayName: 'Attributes Group Name',
							name: 'attributesGroupName',
							type: 'string',
							default: '',
							description: "To recognize attribute properties group in the JSON so that they can be trimmed and can form attribute expression for a tag. This property is not supported when 'Preserve Order' is enabled because attributes are already grouped.",
					},
					{
							displayName: 'CDATA Prop Name',
							name: 'cdataPropName',
							type: 'string',
							default: '__cdata',
							description: 'To recognize CDATA properties in a JSON so that they can be transformed correctly',
					},
					{
							displayName: 'Comment Prop Name',
							name: 'commentPropName',
							type: 'string',
							default: '#comment',
							description: 'To recognize comments in a JSON so that they can be transformed correctly',
					},
					{
						displayName: 'Ignore Attributes',
						name: 'ignoreAttributes',
						type: 'boolean',
						default: false,
						description: 'Whether to ignore attributes when parsing. Must be disabled if applying any options that modify attributes.',
					},
					{
							displayName: 'Indent By',
							name: 'indentBy',
							type: 'string',
							default: '',
							description: "Formatted XML indent character. Applicable only if 'format' is enabled.",
					},
					{
							displayName: 'Preserve Order',
							name: 'preserveOrder',
							type: 'boolean',
							default: false,
							description: 'Whether to keep the order of tags in the output JSON. It also helps the XML builder to build the similar kind of XML from the JSON without losing information.',
					},
					{
							displayName: 'Process Entities',
							name: 'processEntities',
							type: 'boolean',
							default: true,
							description: 'Whether to process XML entities. If you don\'t have entities in your XML document then it is recommended to disable it for better performance.',
					},
					{
							displayName: 'Suppress Boolean Attributes',
							name: 'suppressBooleanAttributes',
							type: 'boolean',
							default: false,
							description: "Whether to parse attributes with value 'true' without their value",
					},
					{
							displayName: 'Suppress Empty Node',
							name: 'suppressEmptyNode',
							type: 'boolean',
							default: false,
							description: 'Whether to output tags with no text value as empty tags',
					},
					{
							displayName: 'Suppress Unpaired Node',
							name: 'suppressUnpairedNode',
							type: 'boolean',
							default: false,
							description: 'Whether to suppress unpaired tags',
					},
					{
							displayName: 'Text Node Name',
							name: 'textNodeName',
							type: 'string',
							default: '#text',
							description: 'To recognize text value for a tag in the JSON so that they can be properly assigned to the tag',
					},
			],
	}
]
