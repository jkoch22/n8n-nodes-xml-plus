# n8n-nodes-xml-plus

An alternative XML node based on fast-xml-parser as opposed to xml2js that's used in the built-in XML node. Designed for performance with larger datasets as well as extra customizability. I built this after running into some issues with the built-in XML node, specifically when I was working with Google's older Data APIs. Chunks of this code are based on the original XML node. It might be a little buggy but hopefully someone else finds it useful as well.

This is an n8n community node. It lets you transform XML data with a high level of customizability in your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Compatibility](#compatibility)  
[Usage](#usage)
[Resources](#resources)  
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

Converting data between JSON and XML formats with the ability to format and validate XML.

Additional documentation on the options included in this node can be found on the fast-xml-parser GitHub [here](https://github.com/NaturalIntelligence/fast-xml-parser/tree/master/docs/v4)

## Compatibility

Tested on v1.78.0 but will probably work with other versions as well.

## Usage

Map XML or JSON data to have it converted.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## Version history

0.0.3 - Bug fix

0.0.2 - Added option to choose incoming JSON field.

0.0.1 - Initial release.

