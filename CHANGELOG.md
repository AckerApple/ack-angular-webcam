# ack-angular-webcam - Change Log
All notable changes to this project will be documented here.

## [1.7.7] - 2018-02-11
- hire me badge

## [1.7.5] - 2018-01-26
- Added [reflect]:boolean

## [1.7.3] - 2018-01-19
- Catch getUserMedia()

## [1.7.1] - 2018-01-04
- Added better facingMode handling

## [1.7.0] - 2018-01-03
- Better camera auto size calculating
- More device info and filtering
- Started creating the ability to switch devices

## [1.6.0] - 2017-12-05
- BREAKING CHANGES
  - Folder "lib" renamed to "src"
  - Updated Angular4 to Angular5
  - Angular4 and 5 are not compatible
  - Stuck in Angular4? User v1.5.0

## [1.5.0] - 2017-11-14
- Cleaned a bit of unnecessary code
- Added WebCamModule
- Added ack-media-devices
- Added useParentWidthHeight binding to ack-webcam
### Breaking Changes
- ack-webcam (onSuccess) is now (success)
- ack-webcam (onError) is now (catch)
- import into NgModule => WebCamModule AND NOT WebCamComponent
  - not a breaking change but new directives/components will not work otherwise

## [1.4.0] - 2017-10-26
- angular 4.2.4 to 4.4.6
- core-js 2.4.1 to 4.4.6
- New Safari getUserMedia() is working!!!!

## [1.3.9] - 2017-08-04
- Added back in ref to cast base64 to dataForm

## [1.3.7] - 2017-07-26
- Ensure all tracks, not just one, are turned off on destroy

## [1.3.5] - 2017-07-25
- Addressed IE11 fallback issues

## [1.3.5] - 2017-07-24
- Fixed removeEventListener bug report

## [1.3.4] - 2017-07-21
- Fixed dynamic source foor fallback
