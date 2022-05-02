import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {fromEvent} from 'rxjs';
import {finalize, take} from 'rxjs/operators';
import {Directions} from '../../../../constants';
import {ToastNotificationsService} from '../../../shared/services/toast-notifications/toast-notifications.service';
import {CVProfileModel} from '../../models/CVProfileModel';
import {DocumentModel} from '../../models/DocumentModel';
import {AvatarPutParameters, EmployeeInterface, EmployeePutInterface} from '../../models/EmployeeModel';
import {FileFormatEnum} from '../../models/FileFormat.enum';
import {EmployeeDataService} from '../../services/employee-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PopupCallbackModel} from '../../../shared/models/popupCallbackModel';
import {DialogService} from 'primeng/dynamicdialog';
import {UserDataModalComponent} from './user-data-modal/user-data-modal.component';
import {EmployeeService} from '../../services/Employee.service';
import {PopupDropdownModel} from '../../../shared/models/popupDropdownModels';
import {ManagersService} from '../../services/Managers.service';
import {AuthenticationService} from '../../../shared/services/authService/auth.service';
import {ConfirmationDialogComponent} from '../../../shared/modals/confirmation-dialog/confirmation-dialog.component';
import {LoadingService} from '../../../shared/services/loader/loader.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
})
export class UserDataComponent implements OnInit {
  public directions = Directions;
  public resumeFileFormats = '.xlsx,.doc,.docx,.pdf';
  @Input() public avatarPath: string;
  @Input() public employeeData: EmployeeInterface;
  @Input() public addResume: boolean;
  @Input() public employeeCv: CVProfileModel;
  @Output() public employeeCVDownload = new EventEmitter<CVProfileModel>();
  @Output() public employeeCVUpdate = new EventEmitter<DocumentModel>();
  @Output() public employeeCVUpload = new EventEmitter<DocumentModel>();
  public items = [
    {label: 'DOCX', command: () => this.downloadDocx(this.employeeCv)},
    {label: 'PDF', command: () => this.downloadPDF(this.employeeCv)}
  ];

  public get fileFormatEnum(): typeof FileFormatEnum {
    return FileFormatEnum;
  }

  public get employeePosition(): string {
    return `${this.employeeData?.positionLevel?.name ?? ''} ${this.employeeData?.positionDirection?.name ?? ''}`;
  }

  public get employeeManager(): string {
    if (this.employeeData?.manager?.firstName && this.employeeData?.manager?.lastName) {
      return `${this.employeeData?.manager?.firstName ?? ''} ${this.employeeData?.manager?.lastName ?? ''}`;
    }
    return '-';
  }

  public get documentFormat(): FileFormatEnum {
    const fileExtension = this.employeeCv?.name?.split('.').pop();
    switch (fileExtension?.toLowerCase()) {
      case 'pdf':
        return FileFormatEnum.PDF;
      case 'xlsx':
        return FileFormatEnum.XLS;
      case 'xls':
        return FileFormatEnum.XLS;
      case 'doc':
        return FileFormatEnum.DOC;
      case 'docx':
        return FileFormatEnum.DOC;
    }
  }

  public get showBackIcon(): boolean {
    return this.router.url !== '/employeeData';
  }

  public get isShowArchiveAction(): boolean {
    return this.authService.isInManagerRole || this.authService.isInOnlyAdminRole;
  }

  private projectId: string;
  private employeeId: string;
  private managers: PopupDropdownModel[] = [];

  constructor(
    private authService: AuthenticationService,
    private employeeDataService: EmployeeDataService,
    private employeeService: EmployeeService,
    private managersService: ManagersService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private toastService: ToastNotificationsService,
    private loader: LoadingService,
  ) {
  }

  public ngOnInit(): void {
    this.loader.changeLoadingState(true);
    this.getManagersList();
    this.activatedRoute.queryParams.subscribe((param: any) => {
      this.projectId = param?.projectId;
      this.employeeId = param?.id;
    });
  }

  public returnLink(): void {
    if (this.projectId) {
      this.router.navigate(['projectsData/ProjectEmployees'], {queryParams: {projectId: this.projectId}});
      return;
    }
    if (this.employeeId) {
      this.router.navigate(['employees']);
      return;
    }
    this.router.navigate(['employeeData']);
  }

  public openModal(): void {
    this.dialogService
      .open(UserDataModalComponent, {
          data: {
            targetEmployee: this.employeeData,
            managers: this.managers,
            imageUrl: this.avatarPath
          },
          styleClass: 'dialog-card'
        }
      ).onClose.subscribe((popupCallback: PopupCallbackModel) => {
      if (popupCallback?.changed) {
        if (popupCallback.body.avatarPutParameters) {
          this.updateAvatar(
            popupCallback.body.avatarPutParameters,
            !!popupCallback.body.updatedData ? popupCallback.body.updatedData : '',
            !!popupCallback.body.updatedData,
            !!popupCallback.body.updatedData ? '' : `Avatar employee ${this.employeeData.lastName} has been updated`);
        } else if (popupCallback.body.updatedData) {
          this.updatePersonalInfo(popupCallback.body.updatedData);
        } else {
          this.toastService.showNotification('warning', {message: `Nothing to update`});
        }
      }
    });
  }

  public archiveEmployee(): void {
    if (this.employeeData.isActive) {
      this.dialogService.open(ConfirmationDialogComponent, {
        data: {
          headerText: `Do you to archive ${this.employeeData.firstName} ${this.employeeData.lastName} employee card?`,
          acceptText: true
        },
        closable: false
      }).onClose.subscribe((confirm: boolean) => {
        if (confirm) {
          const updatedData: EmployeePutInterface = {
            userName: this.employeeData.userName,
            firstName: this.employeeData.firstName,
            lastName: this.employeeData.lastName,
            dateOfBirth: this.employeeData.dateOfBirth,
            startDate: this.employeeData.startDate,
            isManager: this.employeeData.isManager,
            managerId: this.employeeData.managerId,
            isActive: false,
            id: this.employeeData.id,
          };
          this.updatePersonalInfo(updatedData, `Employee ${this.employeeData.lastName} card is now archived`);
        }
      });
    } else {
      this.toastService.showNotification('warning', {message: `Employee ${this.employeeData.lastName} card is already archived`});
    }
  }

  public onFileDownload(): void {
    this.employeeCVDownload.emit(this.employeeCv);
  }

  public downloadPDF(cvItem: CVProfileModel): void {
    if (cvItem) {
      this.loader.changeLoadingState(true);
      this.employeeService
        .downloadCVAsPdf(cvItem.id)
        .pipe(finalize(() => this.loader.changeLoadingState(false)))
        .subscribe((file: Blob) => saveAs(file, cvItem.name));
    }
  }

  public downloadDocx(cvItem: CVProfileModel): void {
    if (cvItem) {
      this.loader.changeLoadingState(true);
      this.employeeService
        .downloadCVAsWord(cvItem.id)
        .pipe(finalize(() => this.loader.changeLoadingState(false)))
        .subscribe((file: Blob) => saveAs(file, `${cvItem.name}.docx`));
    }
  }

  public onFileUpdate(event: any): void {
    this.mapFileFileAndEmit(event.files[0], this.employeeCVUpdate);
  }

  public onFileUpload(event: any): void {
    this.mapFileFileAndEmit(event.files[0], this.employeeCVUpload);
  }

  private mapFileFileAndEmit(file: File, emitter: EventEmitter<any>): void {
    if (file.size === 0) {
      this.toastService.showNotification('error', {message: 'Wrong file size'});
      return;
    }
    const document = new DocumentModel();
    const blobFile = new Blob([file]);
    const reader = new FileReader();
    fromEvent(reader, 'loadend')
      .pipe(take(1))
      .subscribe(() => {
        const arrayBuffer = reader.result;
        // @ts-ignore
        const bytes: number[] = new Uint8Array(arrayBuffer);
        document.file = [...bytes];
        document.name = file.name;
        emitter.emit(document);
      });
    reader.readAsArrayBuffer(blobFile);
  }

  private getManagersList(): void {
    if (this.authService.isInOnlyAdminRole) {
      this.managersService.getManagerList().subscribe((items) => {
        this.managers = this.managersService.getDropdownList(items);
        this.loader.changeLoadingState(false);
      }, () => this.loader.changeLoadingState(false));
    } else if (this.authService.isInManagerRole) {
      this.managersService.getManagerByResourceMan(this.authService.getUserData.id).subscribe((items) => {
        this.managers = this.managersService.getDropdownList(items);
        this.loader.changeLoadingState(false);
      }, () => this.loader.changeLoadingState(false));
    }
  }

  private updatePersonalInfo(formValue: EmployeePutInterface, messageText?: string): void {
    this.loader.changeLoadingState(true);
    this.employeeService.updateEmployee(formValue).subscribe(
      () => this.getPersonalInfo(messageText),
      () => this.loader.changeLoadingState(false));
  }

  private updateAvatar(avatarPutParameters: AvatarPutParameters, updatedInfo: EmployeePutInterface, updateUserInfo: boolean, messageText?: string): void {
    this.loader.changeLoadingState(true);
    this.employeeService.updateAvatar(avatarPutParameters).subscribe(() => {
      this.getAvatar();
      updateUserInfo ? this.updatePersonalInfo(updatedInfo) : this.getPersonalInfo(messageText);
    }, () => this.loader.changeLoadingState(false));
  }

  private getPersonalInfo(messageText?: string): void {
    this.employeeService.getByIdAsync(this.employeeData.id).subscribe((data) => {
      this.employeeData = data;
      this.loader.changeLoadingState(false);
      this.toastService.showNotification('success', {message: messageText ?? 'Personal info has been updated'});
    }, () => this.loader.changeLoadingState(false));
  }

  private getAvatar(): void {
    this.employeeService.getAvatarPath(this.employeeData.id).subscribe(
      (url) => this.avatarPath = url ? url.replace(' ', '') : '/assets/images/unknown-512.png',
      () => this.avatarPath = '/assets/images/unknown-512.png');
  }
}
