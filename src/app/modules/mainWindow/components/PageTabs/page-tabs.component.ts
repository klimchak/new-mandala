import {Component, Input, ViewEncapsulation} from '@angular/core';
import {Tab} from 'src/app/constants';
import {DialogService} from "primeng/dynamicdialog";
import {PopupCallbackModel} from "../../../shared/models/popupCallbackModel";
import {ParamsComponent} from "./params/params.component";
import {MandalaParams} from "../../../shared/models/MandalaParams";
import {ConfirmationDialogComponent} from "../../../shared/modals/confirmation-dialog/confirmation-dialog.component";
import {CoreService} from "../../../shared/services/core/core.service";

@Component({
  selector: 'app-page-tabs',
  templateUrl: './page-tabs.component.html',
  styleUrls: ['./page-tabs.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PageTabsComponent {
  @Input() public openTab = Tab.Notes;
  // @ViewChild(OneToOneMeetingsComponent) private meetingsTableComponent: OneToOneMeetingsComponent;

  public tabNumber = 0;
  public tabButtonLabel = 'Add Note';
  public isOneToOneMeetingTab = false;
  public isProjectsTab = false;
  // public isPersonalInfoTab = true;
  public isPersonalInfoTab = false;
  public mandalaParams!: MandalaParams;

  constructor(private dialogService: DialogService, private rendererService: CoreService) {
  }

  public changeSelectedTab(tabNumber: number): void {
    this.tabNumber = tabNumber;
    this.setTabButtonLabel(tabNumber);
  }

  public tabButtonClick(reminder?: boolean): void {
    this.openTabModal(reminder);
  }

  public openParams(): void {
    this.dialogService
      .open(ParamsComponent, {data: {mandalaParams: this.mandalaParams}})
      .onClose.subscribe((popupCallback: PopupCallbackModel) => {
      if (popupCallback?.changed) {
        this.mandalaParams = popupCallback.body;
        this.rendererService.mandalaParams.next(popupCallback.body);
      }
    });
  }

  public confirmDeleteNoteDialog(): void {
    this.dialogService.open(
      ConfirmationDialogComponent,
      {data: {headerText: `Delete document?`}}
    ).onClose.subscribe((confirm: boolean) => {
      if (confirm) {
        console.log('closed')
      }
    });
  }

  private setTabButtonLabel(tabNumber: number): void {
    if (tabNumber !== Tab.OneToOneMeetings && tabNumber !== Tab.Projects) {
      this.isProjectsTab = false;
      this.isOneToOneMeetingTab = false;
    }
    switch (tabNumber) {
      case Tab.Documents:
        this.tabButtonLabel = 'Add Document';
        break;
      case Tab.Goals:
        this.tabButtonLabel = 'Add Goal';
        break;
      case Tab.Notes:
        this.tabButtonLabel = 'Add Note';
        break;
      case Tab.Notifications:
        this.tabButtonLabel = 'Add Notification';
        break;
      case Tab.OneToOneMeetings:
        this.tabButtonLabel = 'Add Note';
        this.isOneToOneMeetingTab = true;
        break;
      case Tab.Projects:
        this.tabButtonLabel = 'Add Project';
        this.isProjectsTab = true;
        break;
      case Tab.Skills:
        this.tabButtonLabel = 'Add Skill';
        break;
      // case Tab.PersonalInfo:
      //   this.isPersonalInfoTab = true;
      //   break;
    }
    if (this.tabNumber !== Tab.OneToOneMeetings) {
      this.isOneToOneMeetingTab = false;
    }
    // if (this.tabNumber !== Tab.PersonalInfo) {
    //   this.isPersonalInfoTab = false;
    // }
  }

  private openTabModal(reminder?: boolean): void {
    switch (this.tabNumber) {
      case Tab.Documents:
        // this.documentsTableComponent.openModal();
        break;
      case Tab.Goals:
        // this.goalsTableComponent.openModal();
        break;
      case Tab.Notes:
        // this.noteTableComponent.openModal();
        break;
      case Tab.Notifications:
        // this.notificationsTableComponent.openModal();
        break;
      case Tab.OneToOneMeetings:
        // reminder ? this.meetingsTableComponent.openModalReminder() : this.meetingsTableComponent.openModalNote();
        break;
      case Tab.Projects:
        // this.projectTableComponent.openModal();
        break;
      case Tab.Skills:
        // this.skillsTableComponent.openModal();
        break;
    }
  }
}
