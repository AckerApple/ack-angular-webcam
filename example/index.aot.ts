import 'zone.js'
import 'reflect-metadata'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { enableProdMode } from "@angular/core"

//Angular4
//import { AppModuleNgFactory } from './aot/app/app.module.ngfactory'

//Angular5
import { AppModuleNgFactory } from './aot/app/app.module.ngfactory'

enableProdMode()

platformBrowserDynamic().bootstrapModuleFactory( AppModuleNgFactory )