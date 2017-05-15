import 'zone.js'
import 'reflect-metadata'

//import { enableProdMode } from "@angular/core"
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppModule } from './app/app.module'
import { supportDocument } from 'ack-angular-fx/web-animations.min'

supportDocument(document)

//enableProdMode()

platformBrowserDynamic().bootstrapModule(AppModule)
