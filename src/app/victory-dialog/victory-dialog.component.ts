import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-victory-dialog',
  templateUrl: './victory-dialog.component.html',
  styleUrls: ['./victory-dialog.component.css']
})
export class VictoryDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }


}
