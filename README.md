# n8n-nodes-xml-plus

An alternative XML node based on fast-xml-parser as opposed to xml2js that's used in the built-in XML node. Designed for performance with larger datasets and customizability. I built this after running it some issues with the XML node that's bundled with n8n, specifically when I was working with Google's older data APIs. Chunks of this code are based of the original XML node. It might be a little buggy but hopefully someone else finds it helpful as well.

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

JSON to XML

XML to JSON

## Compatibility

n8n >=v1.78.0

## Usage

Feed XML or JSON data to have it converted.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## Version history

0.0.1 - Initial release.

