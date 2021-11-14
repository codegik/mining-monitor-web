import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'dashboard-edit',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './dashboard-edit.component.html',
    styleUrls: [
        './dashboard-edit.component.scss'
    ]
})
export class DashboardEditComponent {
    public place: any = {
        column: null,
        line: null,
        position: null,
        macaddress: null
    };
    constructor(
        public dialogRef: MdDialogRef<DashboardEditComponent>,
        @Inject(MD_DIALOG_DATA) public data: any) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}