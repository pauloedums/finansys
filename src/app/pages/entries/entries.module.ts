import { NgModule } from '@angular/core';
import { EntriesRoutingModule } from './entries-routing.module';
import { EntryFormComponent } from './entry-form/entry-form.component';
import { EntryListComponent } from './entry-list/entry-list.component';


import { CalendarModule } from 'primeng/calendar';
import { IMaskModule } from 'angular-imask';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    EntryListComponent,
    EntryFormComponent,
  ],
  imports: [
    EntriesRoutingModule,
    CalendarModule,
    SharedModule,
    IMaskModule,
  ]
})
export class EntriesModule { }
