# Editro
Customizable html editor written in plain JS. You can think about MS FrontPage in web.
This package contains two build.
* Core build – provide only minimum for building your own editor. This build is useless without addons.
* Normal build. It contains all usefull addons that can be disabled by setting options. Typicaly you want to use it.

This documentation describes Normal build and assumes you use webpack for buildig your app.

# Instalation
```
npm install --production editro
```

# Usage
```
const Editro = require('editro')(); // note: this is factory

// Add addons here
// require('editro/addons/codeMirror')(Editro, CodeMirror);
const root = document.getElementById('html-editor');
const editro = new Editro(root, {
  // options here
});
```

# API
naming: Editro – class, editro – instance.

## Editro instance methods
### editro.setOption(name: string, value: any)
Set option value on instance.
### editro.getOption(name: string) : any
Get option value.
### editro.getNode() : Node
Return DOM node that contains editro.
### editro.getHtml() : string
Return edited html.
### editro.setHtml(html : string)
Set html.
### editro.selectByQuery(query: string)
Select elemetn in editro by query selector.
You can call `editro.selectByQuery('body')` to edit body element.

## class Element

## addon/storage
Save and restore data to/from local storage
### editro.getStorageItem(key: string) : any
### editro.setStorageItem(key: string, valye: any)

## addon/panel
Used by others.
### class Editro.type.Panel
Can be used to create panels. Constructor receive two args: editro and options.
`options.position`

## addon/instruments
Top panel for global buttons. Require addon/panel
### editro.addInstrument(i: Instrument)
Add new instrument to panel. instrument should contain two methods:
* `getNode() : Node` should retun dom node for instrument
* `getGroup() : string` should retun string tag
### class Editro.type.Instrument
Allow you create new instruments on panel in easy way. Example:
```
  editro.addInstrument(new Editro.type.Instrument(editro, {
    icon: require('../../images/arrows-alt.svg'),
    title: 'Fullscreen',
    onClick: () => e.setOption('fullScreen', !e.getOption('fullScreen')), 
    group: 'panels'
  }));
```
Constructor receive two args: editro and options.

## addon/toolbar/tabs
Create tabs in toolbar. Can be enabled or disabled by option.
### editro option **toolboxTabsEnabled** - boolean

## addon/toolbar/panes
Toolbox panes. Used to hold controllers. When created it checks
`Editro.controllers` object to obtain controllers.
Each value of this object should be a controller instance.
### Editro.type.Controller
Helper. Used for extending.
#### constructor(editro[, node])
Node param is optional.
#### controller.onElementSelected(el: element)
Should be overrided. Called when new element selected.
#### controller.toggle(flar: bool)
Show/hide controller.
#### controller.getNode() : Node
Return DOM node fro this controller.
#### controller.getPane() : string
Should be overrided.
### option **defaultPanes** - array

## addon/fullScreen
### option **fullScreen**
You can toggle fullscreen
```
editro.setoption('fullScreen', true);
```
## addon/history
### option **historySize**
### class Editro.type.History
### editro.forward()
Redo
### editro.backward()
Undo

## addon/clearScripts
Define code prerocessors. Editro call them before paste html to/ get html from iframe.
They changed scripts tag to prevent JS execution.
### Editro.codePreprocessor.scripts
### Editro.codePostrocessor.scripts

## addon/upload
### editro.upload(files: array)
Takes array of Files (from form). Returns Promise with array of base64 strings for these files.
Can be overrided for different behavior.

## addon/wysiwyg
Create simple wywisig editro (Quill) for editing text nodes.
### Editro.controllers.Wysiwyg

## addon/controllers/background
## addon/controllers/src
## addon/controllers/href
## addon/controllers/border
## addon/controllers/borderRadius
## addon/controllers/placeholder
## addon/controllers/size
## addon/controllers/position
## addon/controllers/fontFamily
Create controller for font family. You can add additional fonts.
```
Editro.defineHelper('font', '"Super font", sans-serif', {
  fontFamily:  '"Super font", sans-serif',
  source: 'http://' // link to css with font
})
```
## addon/controllers/font

# Addons not in normal build

## addon/uploadToServer
Replace `editro.upload` method. Allow uploding to server.
Specify address via **uploadUrl** option.
Max size via **uploadMaxSize** option.

# Examples
TBD

# Dev
TBD

