# Flowblocks - Reusable flow diagram blocks
> Building flow diagrams

## General info

## Building blocks
### Block
> Block represents a single element on a flow diagram

Each block is represented by inputs and outputs (connections with other blocks) as well as block parameters that can be configured by user.

Each block has its state (valid/invalid). Each time block is changed (either connection is added or configurable value is changed) validation is triggered and block state is updated accordingly.

Each block has a definition of parameters that can be configured on the block. The definition defines the name, type and mandatory of the configurable.

### Properties
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

### Validations
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

## API 
### Block
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



