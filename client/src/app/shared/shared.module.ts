import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TimeAgoPipe} from 'time-ago-pipe';
import {LeafletModule} from "@asymmetrik/ngx-leaflet";

@NgModule({
    declarations: [TimeAgoPipe],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        LeafletModule.forRoot(),
    ],
    exports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        TimeAgoPipe,
        ReactiveFormsModule,
        LeafletModule
    ]
})
export class SharedModule {
}
