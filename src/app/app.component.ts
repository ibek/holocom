import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { ShipService } from './ship.service';
import { Joystick } from './util/Joystick';

import * as sha256 from 'crypto-js/sha256';
import * as hmacSHA512 from 'crypto-js/hmac-sha512';
import * as Base64 from 'crypto-js/enc-base64';

import './styles.scss';

@Component({
  selector: 'u-tec',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private shipService: ShipService, private router: Router, public lockDialog: MdDialog, private joystick: Joystick) {

  }

  newTacticalPlan(): void {
    window.location.href = '/';
  }

  welcome(): void {
    this.joystick.hide();
    this.router.navigate(["welcome"], this.shipService.getNavigationExtras());
  }

  inventory(): void {
    this.joystick.hide();
    this.router.navigate(["inventory"], this.shipService.getNavigationExtras());
  }

  simulator(): void {
    this.router.navigate(["simulator"], this.shipService.getNavigationExtras());
  }

  lock(): void {
    let dialogRef = this.lockDialog.open(LockDialogComponent, {
      data: { "type": "Lock" },
    });
    dialogRef.afterClosed().subscribe(pwd => {
      if (pwd !== "Cancel") {
        this.shipService.setPassword(pwd);
      }
    });
  }

  unlock(): void {
    let dialogRef = this.lockDialog.open(LockDialogComponent, {
      data: { "type": "Unlock" },
    });
    dialogRef.afterClosed().subscribe(pwd => {
      if (pwd !== "Cancel") {
        this.shipService.passwordHash = Base64.stringify(hmacSHA512(sha256(pwd), pwd));
      }
    });
  }

  donate(): void {
    window.open("https://donorbox.org/uee-tactical-communications-interface", "_blank");
  }

}

@Component({
  selector: 'lock-dialog',
  templateUrl: 'lock-dialog.html',
})
export class LockDialogComponent {
  constructor(public dialogRef: MdDialogRef<LockDialogComponent>, @Inject(MD_DIALOG_DATA) public data: any) { }
}
