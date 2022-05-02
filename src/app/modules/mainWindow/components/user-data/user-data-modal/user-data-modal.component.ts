import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToastNotificationsService} from '../../../../shared/services/toast-notifications/toast-notifications.service';
import {PopupActionsEnum} from '../../../../shared/models/popupActions.enum';
import {PopupCallbackModel} from '../../../../shared/models/popupCallbackModel';
import {AvatarPutParameters, EmployeeInterface, EmployeePutInterface} from '../../../models/EmployeeModel';
import {TalentValidators} from '../../../../shared/validators/TalentValidators';
import {PopupDropdownModel} from '../../../../shared/models/popupDropdownModels';
import {find, isEmpty} from 'lodash';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {Location} from '@angular/common';
import {$animations} from '../../../../shared/animations/animations';
import {LoadedImage} from 'ngx-image-cropper/lib/interfaces/loaded-image.interface';
import {AuthenticationService} from '../../../../shared/services/authService/auth.service';

@Component({
  selector: 'app-user-data-modal',
  templateUrl: './user-data-modal.component.html',
  styleUrls: ['./user-data-modal.component.scss'],
  animations: $animations,
})
export class UserDataModalComponent implements OnInit {
  @ViewChild('fileInput') public fileInput;
  public userInfoForm: FormGroup;
  public dropdownManager: PopupDropdownModel[] = [];
  public dropdownOffice: PopupDropdownModel[] = [];
  public showBackDrop = false;
  public inImageCropper = false;
  public uploadNewImage = false;
  public imageChangedEvent: Event;
  public croppedImage: string;
  public originalImage: string;

  public get showFilterManagers(): boolean {
    return this.dropdownManager.length >= 10;
  }

  public get showFilterOffice(): boolean {
    return this.dropdownOffice.length >= 10;
  }

  public get imageUrl(): string {
    if (this.dynamicDialogConfig.data?.imageUrl) {
      return this.dynamicDialogConfig.data?.imageUrl;
    } else {
      return `${this.location['_platformLocation'].location.origin}/assets/images/unknown-512.png`;
    }
  }

  private croppedImageData: ImageCroppedEvent;

  private get targetUserInfo(): EmployeeInterface {
    return this.dynamicDialogConfig.data?.targetEmployee;
  }

  private get managersDropdownData(): PopupDropdownModel[] {
    return this.dynamicDialogConfig.data?.managers;
  }

  constructor(
    private dialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private toastNotificationService: ToastNotificationsService,
    private authService: AuthenticationService,
    private location: Location
  ) {
  }

  private static DataURIToBlob(dataURI: string): Blob {
    const splitDataURI = dataURI.split(',');
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type: mimeString});
  }

  public ngOnInit(): void {
    let defaultManager: PopupDropdownModel;
    if (!isEmpty(this.managersDropdownData)) {
      this.dropdownManager = this.managersDropdownData;
      defaultManager = find(this.dropdownManager, (item) => item.value === this.targetUserInfo?.managerId);
    } else {
      this.dropdownManager.push({
        text: `${this.targetUserInfo?.manager?.firstName} ${this.targetUserInfo?.manager?.lastName}`,
        value: this.targetUserInfo.managerId
      });
      defaultManager = this.dropdownManager[0];
    }
    this.initForm(this.targetUserInfo, defaultManager);
  }

  public processForm(): void {
    this.userInfoForm.markAllAsTouched();
    if (this.userInfoForm.valid) {
      let updatedData: EmployeePutInterface;
      let avatarPutParameters: AvatarPutParameters;
      if (
        this.targetUserInfo.userName !== this.userInfoForm.get('userName').value?.trim() ||
        this.targetUserInfo.managerId !== this.userInfoForm.get('managerId').value
      ) {
        updatedData = {
          userName: this.userInfoForm.get('userName').value.trim(),
          // TODO: after update models on backed will need add skype && officeId
          firstName: this.targetUserInfo.firstName,
          lastName: this.targetUserInfo.lastName,
          dateOfBirth: this.targetUserInfo.dateOfBirth,
          startDate: this.targetUserInfo.startDate,
          isManager: this.targetUserInfo.isManager,
          managerId: this.userInfoForm.get('managerId').value,
          isActive: false,
          id: this.targetUserInfo.id,
        };
      }
      if (this.uploadNewImage) {
        const interimData: FormData = new FormData();
        interimData.append(
          'image',
          UserDataModalComponent.DataURIToBlob(this.originalImage),
          `${this.targetUserInfo.firstName}-${this.imageChangedEvent.target['value'].replace(/.*[\/\\]/, '')}`,
        );
        avatarPutParameters = {
          height: this.croppedImageData.height,
          width: this.croppedImageData.width,
          coordinate_X: this.croppedImageData.imagePosition.x1,
          coordinate_Y: this.croppedImageData.imagePosition.y1,
          originalImage: interimData,
        };
      }
      const popupCallback = {
        body: {updatedData, avatarPutParameters},
        action: PopupActionsEnum.UPDATE,
        changed: true
      } as PopupCallbackModel;
      this.closeModalWindow(popupCallback);
    } else {
      this.toastNotificationService.showNotification('warning', {message: 'Data in the fields is not valid'});
    }
  }

  public closeModalWindow(callback?: PopupCallbackModel): void {
    this.dialogRef.close(callback);
  }

  public mouseLeaveBackDrop(inBackDrop: boolean): void {
    this.showBackDrop = inBackDrop;
  }

  public mouseActionImageCropper(inImageCropper?: boolean): void {
    this.inImageCropper = inImageCropper;
  }

  public uploadImage(): void {
    this.fileInput.nativeElement.click();
  }

  public resetImage(): void {
    this.uploadNewImage = false;
    this.fileInput.nativeElement.value = '';
  }

  public fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
    this.uploadNewImage = true;
  }

  public imageLoaded(event: LoadedImage): void {
    this.originalImage = event.original.base64;
  }

  public imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
    this.croppedImageData = event;
  }

  public loadImageFailed(): void {
    this.toastNotificationService.showNotification('warning', {message: 'Error when upload image. Please try again.'});
  }

  private initForm(userInfo: EmployeeInterface, defaultManager: PopupDropdownModel): void {
    this.userInfoForm = new FormGroup({
      userName: new FormControl(userInfo?.userName ?? '', [TalentValidators.required(), TalentValidators.email]),
      skype: new FormControl({value: userInfo?.skype ?? '', disabled: true}, TalentValidators.required()),
      managerId: new FormControl({
        value: userInfo?.managerId ?? defaultManager?.value,
        disabled: !(this.authService.isInAdminRole || this.authService.isInManagesRole)
      }, TalentValidators.required()),
      office: new FormControl({value: '', disabled: true}, TalentValidators.required()),
    });
  }
}
