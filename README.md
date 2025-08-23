

# OlympicGamesStarter

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

## Before to start
- [npx] ng version
- npm install

## Dev and build command
- npm start                        // http://localhost:4200/
- [npx] ng serve [--host 0.0.0.0]  // 

- npm build                        // dist/
- [npx] ng build                   // 

## Where to start
src/app :
- `components` folder: contains every reusable components
- `pages` folder: contains components used for routing
- `core` folder: contains the business logic (`services` and `models` folders)

## Main dependencies

- @compodoc/compodoc
- @swimlane/ngx-charts
- rxjs
- tslib

# Compodoc sections

## Compodoc intro

`/docs` folder is our custom folder place.
`/documentation` folder is the auto-generated files by below command.

- npx compodoc --watch --serve -p .\tsconfig.json --templates docs/templates
- npx compodoc -p tsconfig.json --templates docs/templates

NB : Template is used for enhanced DOM tree, including class name in each node. If tree-custom is updated on your own, please update `/docs/tree-custom` then copy it in `documentation/js`. 

## DOM tree

http://localhost:8080/components/HomeComponent.html#dom-tree
http://localhost:8080/components/DetailsComponent.html#dom-tree

# Diagrams

Check handmade diagrams here [here (/docs/diagrams)](/docs/diagrams/) 

![](/docs/diagrams/main-diagram) 
![](/docs/diagrams/data-flow-diagram) 

/!\ Please note as it is handmade, it could be outdated in later iterations