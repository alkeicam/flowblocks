# Flowblocks - Reusable flow diagram blocks
> Building flow diagrams

[Flowblocks - Reusable flow diagram blocks](#flowblocks---reusable-flow-diagram-blocks)
* [General info](#general-info)
* [Building blocks](#building-blocks)   
    * [TypeDefinition](#typedefinition)  
    * [PortTemplates](#porttemplates)   
    * [Block](#block)            
        * [Properties](#properties)
        * [Validations](#validations)
* [API](#api)
    * [Flowblocks](#flowblocks)
        - [getDefinition(typeName)](#getdefinitiontypename)
    * [Flowblocks.Block](#flowblocksblock)
        - [block.getConfigurable(name)](#blockgetconfigurablename)
        - [block.getConfigurables()](#blockgetconfigurables)
        - [block.getStatus()](#blockgetstatus)            
        - [block.setConfigurable(name, value)](#blocksetconfigurablename-value)
        - [block.setConfigurables(configurablesArray)](#blocksetconfigurablesconfigurablesarray)
## General info



## Building blocks

### TypeDefinition
> Specifies block attributes and behaviour

In Flowblocks each block that is created in the diagram is a block of a given type.
Types allow to specify all attributes and block behaviour, they are like a template from which all blocks of given type are created.

| Name | Type | Description | 
| :--- | :--- | :--- | 
| name | `string` | Unique Name/Id of the type, when block is created this is passed as its type (block property *block._type* is set to this value) |
| template | `string` | Ports template to be used when block of given type is created. See PortTemplates for more details.|
| style | `string|object` | Name of the flowblocks style or a specification of a custom style. Style is used when rendering block on a diagram. See custom styling for more details.|
| icon | `string` | Name of the flowblocks preset icons or a link to a resource that is an icon. See [flowblocks-icons](https://www.npmjs.com/package/flowblocks-icons) for a list of available icons.|
| configurables | `array<objec>` | Array of configurables definitions. These specify what custom attributes can be set on the block. See Configurables for a detailed description.|
| category | `string` | When there are plenty of available block types that can be used to build flowblocks diagrams category can be used to group types into similar categories. When used in graphical designer this usually is rendered as groups of available types|
| validationSrc | `string` | Source code of a custom validation functions. See [Validations](#validations) for a detailed description of how such a function should be constructed |


### PortTemplates
> Specifies input and output port for a block

| Name | Description | 
| :--- | :--- | 
| `Start` | Types that use this template have only one output port named `out1`. These are always used as an input/start blocks in diagrams |
| `End` | Types that use this template have only one input port named `in1`. These are always used as an output/end blocks in diagrams |
| `PassThrough` | Types that use this template have single input port named `in1` and a single output port `out1`. |
| `Split` | Types that use this template have single input port named `in1` and a two output ports named `out1`, `out2`. |
| `Join` | Types that use this template have two input port named `in1`, `in2` and a single output port `out1`. |
| `Mixer` | Types that use this template have two input port named `in1`, `in2` and a two output ports named `out1`, `out2`. |


### Block
> Block represents a single element on a flow diagram

Each block is represented by inputs and outputs (connections with other blocks) as well as block parameters that can be configured by user.

Each block has its state (valid/invalid). Each time block is changed (either connection is added or configurable value is changed) validation is triggered and block state is updated accordingly.

Each block has a definition of parameters that can be configured on the block. The definition defines the name, type and mandatory of the configurable.

#### Properties
| Name | Type | Description | 
| :--- | :--- | :--- | 
| configurablesDefinitions | `array<object>` | Definition of configurables available in the block |
| configurablesDefinitions.id | `string` | Name/Id of the configurable. When calling block.get/setConfigurable() this id/name is used | 
| configurablesDefinitions.label | `string` | Label of the configurable. Used to display in designer/ui |
| configurablesDefinitions.placeholder | `string` | Placeholder of the configurable. Used to display in designer/ui |
| configurablesDefinitions.type | `string` | Type of the configurable. One of `TEXT`, `NUMBER`, `LIST`, `BOOLEAN` |
| configurablesDefinitions.options | `array<{v,l}>` | Used when type of configurable is `LIST`. Provides available options on the list that can be selected by the user |
| configurablesDefinitions.required | `boolean` | When true user must provide the configurable of the block will be marked as invalid |
| configurables | `array<{i: configurable name/id, v: configurable value}>` | Configuration parameters of the block. Each time configuration parameter is updated block revalidation is performed | 

#### Validations
When block is updated validations are triggered. There are two types of validations for each block.

**Built in validations**

These include
* checking that all ports (input/output) are connected
* checking that all configurables markes as *required* are provided

**Custom validations**

Each block can have its custom validations. Configuration of the custom validation is by providing custom validation function for block:
```javascript
function (blockData) {
    var errors = [];   
                
    var item = blockData.configurable('units');
                
    if(item && (isNaN(Number(item))||Number(item)<0 ||!Number.isInteger(Number(item)))){
        errors.push({ code: 'P_UNITS', cId: 'Units', msg: 'Units must be a positive integer' })
    }                     
                
    return errors;
}
```
Each custom validation functions takes blockData as its input and is expected to return array of errors. When there are no errors (validation successfull) then error array must be empty, when there are any validation errors then these errors must be put into the resulting error array.

## API 
### Flowblocks
#### getDefinition(typeName)
> Returns type definition registered with given name
```javascript
var typeDefinition = flowblocks.getDefinition('myType');
```

|Kind| Parameter | Type | Description |
| :--- | :--- | :--- | :--- |
|Argument| `name` | `string` | **Required** Name of the configurable |
|Returns|   | `string | number | boolean | array` | Value of the configurable with given name|

### Flowblocks.Block
#### block.getConfigurable(name)
> Returns configurable value with given name
```javascript
var units = block.getConfigurable('units');
```

|Kind| Parameter | Type | Description |
| :--- | :--- | :--- | :--- |
|Argument| `name` | `string` | **Required** Name of the configurable |
|Returns|   | `string | number | boolean | array` | Value of the configurable with given name|

#### block.getConfigurables()
> Returns block configurables array
```javascript
var configurables = block.getConfigurables();
configurables.forEach(configurable=>{
    var idName = configurable.i;
    var value = configurable.v;
})

```

|Kind| Parameter | Type | Description |
| :--- | :--- | :--- | :--- |
|Returns|   | `array<{i, v}>` | Array of block configurable items |

#### block.getStatus()
> Returns validation status of block
```javascript
var status = block.getStatus();
var isValid = status.valid;
var errors = status.errors;
errors.forEach(error=>{
    var errorCode  = error.code; // 'FIELD_REQUIRED',
    var errorAttributeId = error.cId;
    var errorMessage = error.msg// 'Field ['+requiredItem.id+'] is required'
})
```

|Kind| Parameter | Type | Description |
| :--- | :--- | :--- | :--- |
|Returns|   | `object` | Status of the block |
|Returns| .valid  | `boolean` | True when block is valid |
|Returns| .errors  | `array<{code, cId, msg}>` | Array of errors |
|Returns| .errors[i].code  | `string` | Error code |
|Returns| .errors[i].cId  | `string` | Id of the invalid element/property/configurable |
|Returns| .errors[i].msg  | `string` | Error message |

#### block.setConfigurable(name, value)
> Sets/updates configurable with given name. Revalidation is performed.
```javascript
block.setConfigurable('units',7);
```

|Kind| Parameter | Type | Description |
| :--- | :--- | :--- | :--- |
|Argument| `name` | `string` | **Required** Name of the configurable |
|Argument| `value` | `any` | **Required** Value of the configurable |

#### block.setConfigurables(configurablesArray)
> Sets/updates configurables. Revalidation is performed.
```javascript
var configurables = [
    {i: 'name1', v: '7'},{i: 'name2', v: 'something'},
]
block.setConfigurables(configurables);
```

|Kind| Parameter | Type | Description |
| :--- | :--- | :--- | :--- |
|Argument| `configurablesArray` | `array<{i, v}>` | **Required** Configurables array|

## Events

### Model lifecycle events

#### flowblocks:save-ok
> Emmited when model is saved (either via creation or update). Updated values are returned

| Parameters | Description |
| :--- | :--- |
| datatype | type of the entity|
| specificationId | id of the saved entity |
| specificationVersion | version of the saved entity  |
| specificationData | data of the saved enitty |





