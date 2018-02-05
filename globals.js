/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"cffdd64a-b7dc-46ba-95da-e86a072b41dd",variableType:4}
 */
var SVY_MOD_DIALOGS_GLOBAL_DIALOGHEIGHT = 100;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"b03963ca-5ada-423a-9508-171b37a03be1",variableType:8}
 */
var SVY_MOD_DIALOGS_GLOBAL_DIALOGWIDTH = 490;

/**
 * @properties={typeid:35,uuid:"12F080AD-7D54-4FA9-B61B-405EFAFFCEF9",variableType:-4}
 */
var SVY_MOD_DIALOG_TERMINATOR = (APPLICATION_TYPES.WEB_CLIENT == application.getApplicationType() ? new Continuation() : null);

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"AE738ED7-B3E6-4978-8FA6-D31CF6C1ABCF"}
 */
var svy_mod_version = '5.2.7.644';

/**
 *  Fuction executed when the custom dialog is hidden. Returns the call stack from the continuation.
 * @private
 * @param {JSEvent} _event
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @properties={typeid:24,uuid:"0faf5e95-5f74-448b-bf22-6ef8cad5ae68"}
 */
function svy_mod_dialogs_global_customhide(_event) {
	var fn = _event.getFormName();
	/** @type {Function} */
	var cont = forms[fn]['CONTINUATION'];
	var retv = forms[fn]['RETURNVALUE'];
	cont(retv);
}

/**
 * Fills the return value with the button name and calls svy_mod_dialogs_global_okClicked. Called when the user pressed a button on the error dialog.
 *  @private
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 * @param {JSEvent} _event
 *
 *
 * @properties={typeid:24,uuid:"acceb3e3-52f5-4de1-bf18-459f4d462b70"}
 * @AllowToRunInFind
 */
function svy_mod_dialog_global_errorDialogButtonPressed(_event) {
	//controller.search() - to make it work in find mode
	var pressedbutton = _event.getElementName();
	var fm = _event.getFormName();
	forms[fm]['returnValue'] = forms[fm].elements[pressedbutton].text;
	svy_mod_dialogs_global_okClicked(_event);
}

/**
 * Closes the dialog and restores the call stack from the continuation returning the value. Called when the user pressed an ok button on a dialog.
 * @private
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"1ab485b7-71fc-4c7c-926c-87fab4dc77cf"}
 * @AllowToRunInFind
 */
function svy_mod_dialogs_global_okClicked(_event) {

	//controller.search() - to make it work in find mode
	var fn = _event.getFormName();
	/** @type {Function} */
	var c = forms[fn].dialogContinuation;
	var r = forms[fn].returnValue;
	var dn = forms[fn].dialogName;
	globals.svy_mod_closeForm(_event);
	application.updateUI();
	history.removeForm(dn)
	if (application.getApplicationType() == 5) c(r);
}

/**
 * Closes the dialog and restores the call stack from the continuation. Called when the user pressed a cancel button on a dialog.
 * @private
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 * @param {JSEvent} _event
 * @properties={typeid:24,uuid:"64ea29fb-a817-442b-ac6b-4fcd2bd6076d"}
 */
function svy_mod_dialogs_global_cancelClicked(_event) {
	var fn = _event.getFormName();

	/** @type {Function} */
	var cont = forms[fn].dialogContinuation;

	globals.svy_mod_closeForm(_event);
	
	if (application.getApplicationType() == 5) cont(null);
}

/**
 * Creates a new form using the SolutionModel. Each form has a unique name
 * @private
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @param {String} baseform_name 
 *
 * @properties={typeid:24,uuid:"c9a8ee72-b9ef-4e55-98ae-c7fef9349844"}
 */
function svy_mod_dialogs_global_createNewForm(baseform_name) {
	var baseform = solutionModel.newForm(baseform_name + application.getUUID(), null, '', false, SVY_MOD_DIALOGS_GLOBAL_DIALOGWIDTH, SVY_MOD_DIALOGS_GLOBAL_DIALOGHEIGHT);

	return baseform;
}

/**
 * Creates the elements on the base dialog form
 *
 * @private
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @param {JSForm} baseform The form created with the SolutionModel
 * @properties={typeid:24,uuid:"e3f91db8-3b8e-471f-a3cd-0d48dc27ece9"}
 */
function svy_mod_dialogs_global_createBaseDialogElements(baseform) {

	baseform.navigator = SM_DEFAULTS.NONE;

	baseform.newVariable('dialogContinuation', JSVariable.MEDIA);
	baseform.newVariable('dialogName', JSVariable.TEXT);
	baseform.newVariable('dialogTitle', JSVariable.TEXT);
	baseform.newVariable('returnValue', JSVariable.TEXT);
}

/**
 * Creates the elements on the error dialog form
 * @private
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @param {JSForm} baseform The form created with the SolutionModel
 * @param {Number} buttons The number of buttons
 *
 * @properties={typeid:24,uuid:"2afd63e7-f284-4359-a4d7-3997ead2eea6"}
 */
function svy_mod_dialogs_global_createErrorDialogElements(baseform, buttons) {

	svy_mod_dialogs_global_createBaseDialogElements(baseform);

	baseform.newVariable('buttons', JSVariable.MEDIA);
	baseform.newVariable('dialogImage', JSVariable.TEXT);
	baseform.newVariable('dialogMsg', JSVariable.TEXT);

	var img = baseform.newLabel('', 10, 10, 51, 41);
	img.name = 'img';

	var msglabel = baseform.newLabel('', 70, 10, 411, 51);
	msglabel.dataProviderID = 'dialogMsg';
	msglabel.name = 'labelmsg';

	for (var i = 0; i < buttons; i++) {
		var b = baseform.newButton('button', 30, 70, 80, 20, svy_mod_dialog_global_errorDialogButtonPressed);
		b.name = 'button' + (i + 1);
	}

}

/**
 * Creates the elements on the input dialog form
 *
 * @private
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @param {JSForm} baseform The form created with the SolutionModel
 *
 * @properties={typeid:24,uuid:"23a0df44-aa2e-4841-b7b4-a67824d50df4"}
 */
function svy_mod_dialogs_global_createInputDialogElements(baseform) {

	svy_mod_dialogs_global_createBaseDialogElements(baseform);

	baseform.newVariable('dialogImage', JSVariable.TEXT);
	baseform.newVariable('dialogMsg', JSVariable.TEXT);

	var img = baseform.newLabel('', 10, 10, 51, 41);
	img.name = 'img';

	var msglabel = baseform.newLabel('', 70, 10, 411, 21);
	msglabel.dataProviderID = 'dialogMsg';

	baseform.newField('returnValue', JSField.TEXT_FIELD, 70, 40, 411, 20);

	var b1 = baseform.newButton('OK', 160, 70, 80, 20, svy_mod_dialogs_global_okClicked);
	b1.name = 'bOK';
	var b2 = baseform.newButton('Cancel', 250, 70, 80, 20, svy_mod_dialogs_global_cancelClicked);
	b2.name = 'bCancel';
}

/**
 * Creates the elements on the select dialog form
 *
 * @private
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @param {JSForm} baseform The form created with the SolutionModel
 * @param {Array} options List of options to fill the dataset. Each option is separated by '\n'
 *
 * @properties={typeid:24,uuid:"640e0380-89aa-4380-8bcf-419c6e7230ed"}
 */
function svy_mod_dialogs_global_createSelectDialogElements(baseform, options) {
	
	svy_mod_dialogs_global_createBaseDialogElements(baseform);

	baseform.newVariable('arroptions', JSVariable.MEDIA);
	baseform.newVariable('dialogImage', JSVariable.TEXT);
	baseform.newVariable('dialogMsg', JSVariable.TEXT);
	baseform.newVariable('options', JSVariable.TEXT);

	var img = baseform.newLabel('', 10, 10, 51, 41);
	img.name = 'img';

	var msglabel = baseform.newLabel('', 70, 10, 411, 20);
	msglabel.dataProviderID = 'dialogMsg';

	var sel = baseform.newField('returnValue', JSField.COMBOBOX, 70, 40, 411, 20);
	sel.name = 'sel';

	
	var valln = baseform.name + '_valuelist'+ application.getUUID();
	var vall = solutionModel.newValueList(valln, JSValueList.CUSTOM_VALUES);
	vall.customValues = options;
	sel.valuelist = vall;

	var b1 = baseform.newButton('OK', 160, 70, 80, 20, svy_mod_dialogs_global_okClicked);
	b1.name = 'bOK';
	var b2 = baseform.newButton('Cancel', 250, 70, 80, 20, svy_mod_dialogs_global_cancelClicked);
	b2.name = 'bCancel';

}

/**
 * Fills the base dialog form with data supplied in the parameters
 *
 * @private
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @param {JSForm} baseform The form created with the SolutionModel
 * @param {String} formTitle The form title
 * @param {String} defaultReturnValue The default return value
 * @param {String} defaultFormTitle The default form title
 *
 * @properties={typeid:24,uuid:"e92c32b0-f93a-4a6f-a64c-7f9e3e1614d8"}
 */
function svy_mod_dialogs_global_fillBaseDialogElements(baseform, formTitle, defaultReturnValue, defaultFormTitle) {
	
	var dialogTitle = (formTitle) ? formTitle : defaultFormTitle;
	var returnvalue = (defaultReturnValue) ? defaultReturnValue : "";

	forms[baseform.name]['dialogName'] = baseform.name;
	forms[baseform.name]['dialogTitle'] = dialogTitle;
	forms[baseform.name]['returnValue'] = returnvalue;
}

/**
 * Fills the error dialog form with data supplied in the parameters
 *
 * @private
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @param {JSForm} baseform The form created with the SolutionModel
 * @param {String} formTitle The form title
 * @param {String} message Message shown on the dialog
 * @param {Array<String>} buttons Array with the buttons
 * @param {String} defaultFormTitle The default form title
 * @param {String} formImageName Image to be displayed on the form
 *
 * @properties={typeid:24,uuid:"2ca51a17-187d-4e77-8bcd-3ad14806b6e1"}
 */
function svy_mod_dialogs_global_fillErrorDialogElements(baseform, formTitle, message, buttons, defaultFormTitle, formImageName) {
	
	var dialogMsg = (message) ? message : "";
	
	var buttonsCount = buttons.length;

	var btwidth = 80;
	var btspace = 10;

	var windowwidth = Math.max(SVY_MOD_DIALOGS_GLOBAL_DIALOGWIDTH, (btwidth + btspace) * buttonsCount + 100);
	baseform.width = windowwidth;
	baseform.getLabel('labelmsg').width = windowwidth - 80;
	
	// MAVariazione - heighten the window if necessary
	var windowheight = SVY_MOD_DIALOGS_GLOBAL_DIALOGHEIGHT;
	var lines = message.split('\n');
	if (lines && lines.length > 5)
	{
		windowheight = lines.length * Math.floor((SVY_MOD_DIALOGS_GLOBAL_DIALOGHEIGHT / 5));
		baseform.getBodyPart().height = windowheight;
		baseform.getLabel('labelmsg').height += lines.length * Math.floor(baseform.getLabel('labelmsg').height / 5);
		baseform.getLabel('labelmsg').verticalAlignment = SM_ALIGNMENT.TOP;
	}

	var bty = windowheight - 30;//SVY_MOD_DIALOGS_GLOBAL_DIALOGHEIGHT - 30;
	var left = (windowwidth - (buttonsCount * btwidth + (buttonsCount - 1) * btspace)) / 2;

	svy_mod_dialogs_global_fillBaseDialogElements(baseform, formTitle, "", defaultFormTitle);

	//get i18n value if i18n is used
	if(utils.stringPatternCount(dialogMsg,'i18n:'))
	{
		dialogMsg = i18n.getI18NMessage(dialogMsg)
	}
	
	// MAVariazione - format the message if in web-client
	if(application.getApplicationType() === APPLICATION_TYPES.WEB_CLIENT)
		dialogMsg = globals.convertString(dialogMsg);
	
	forms[baseform.name]['dialogImage'] = formImageName;
	forms[baseform.name]['dialogMsg'] = dialogMsg;
	forms[baseform.name]['buttons'] = buttons;

	forms[baseform.name].controller.recreateUI()
	
	forms[baseform.name].elements['img'].setImageURL(formImageName);

	for (var i = 0; i < buttonsCount; i++) {
		var name = 'button' + (i + 1);
		
		//get i18n value if i18n is used
		if(utils.stringPatternCount(buttons[i],'i18n:'))
		{
			buttons[i] = i18n.getI18NMessage(buttons[i])
		}

		var btx = left + i * (btwidth + btspace)
		forms[baseform.name].elements[name].setLocation(btx, bty);

		forms[baseform.name].elements[name]['text'] = buttons[i];
	}
}

/**
 * Fills the input dialog form with data supplied in the parameters
 *
 * @private
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @param {JSForm} baseform The form created with the SolutionModel
 * @param {String} formTitle The form title
 * @param {String} message Message shown on the dialog
 * @param {String} defaultReturnValue The default return value
 * @param {String} defaultFormTitle The default form title
 * @param {String} formImageName Image to be displayed on the form
 *
 * @properties={typeid:24,uuid:"70b2de5d-0912-4cf5-b49c-b8bde243afca"}
 */
function svy_mod_dialogs_global_fillInputDialogElements(baseform, formTitle, message, defaultReturnValue, defaultFormTitle, formImageName) {
	
	svy_mod_dialogs_global_fillBaseDialogElements(baseform, formTitle, defaultReturnValue, defaultFormTitle);

	var dialogMsg = (message) ? message : "";
	var dialogImage = formImageName

	forms[baseform.name]['dialogImage'] = dialogImage;
	forms[baseform.name]['dialogMsg'] = dialogMsg;

	forms[baseform.name].elements['img'].setImageURL(dialogImage);
}

/**
 * Fills the select dialog form with data supplied in the parameters
 *
 * @private
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @param {JSForm} baseform The form created with the SolutionModel
 * @param {String} formTitle The form title
 * @param {String} message Message shown on the dialog
 * @param {String} defaultReturnValue The default return value
 * @param {String} defaultFormTitle The default form title
 * @param {String} formImageName Image to be displayed on the form
 * @param {Array} options List of options to be displayed. Each option is separated by '\n'
 * @param {Array} arroptions Array containing the list of options
 *
 * @properties={typeid:24,uuid:"a89485f7-de29-4eb4-a857-04d4ece2c07b"}
 */
function svy_mod_dialogs_global_fillSelectDialogElements(baseform, formTitle, message, defaultReturnValue, defaultFormTitle, formImageName, options, arroptions) {

	svy_mod_dialogs_global_fillBaseDialogElements(baseform, formTitle, defaultReturnValue, defaultFormTitle);

	var dialogMsg = (message) ? message : "";
	var dialogImage = formImageName;

	forms[baseform.name]['arroptions'] = arroptions;
	forms[baseform.name]['dialogImage'] = dialogImage;
	forms[baseform.name]['dialogMsg'] = dialogMsg;
	forms[baseform.name]['options'] = options;

	forms[baseform.name].elements['img'].setImageURL(dialogImage);
	forms[baseform.name].controller.recreateUI()
}

/**
 * Shows a dialog on the clients screen. If called from a web client, it uses JavaScript Continuation to save the execution state.
 *
 * @private
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @param {JSForm} fm The form created with the SolutionModel
 * @param {Function} nonwebcall The function to call when the client is not a web client.
 * @param {Boolean} [modal]
 *
 * @returns {String} The dialog returned value
 *
 * @properties={typeid:24,uuid:"dcc22920-e5ce-436b-bd03-e1684013ab6c"}
 */
function svy_mod_dialogs_global_showDialog(fm, nonwebcall, modal ) {
	if (application.getApplicationType() == APPLICATION_TYPES.WEB_CLIENT) {
		var dialogContinuation = new Continuation();
		globals.svy_mod_showFormInDialog(forms[fm.name], -1, -1, -1, -1, forms[fm.name].dialogTitle, false, false, fm.name, modal);
		forms[fm.name]['dialogContinuation'] = dialogContinuation;
		new Continuation()
	} else {
		return nonwebcall(fm);
	}
	return null
}

/**
 * Creates an array with parameters to be sent to dialogs from the dialogsPlugin
 *
 * @private
 *
 * @author Bogdan Diaconescu
 * @since 24 March 2009
 *
 * @param {JSForm} baseform The form created with the SolutionModel
 *
 * @returns {Array} The arguments array
 *
 * @properties={typeid:24,uuid:"9c9a2b7b-1761-403d-b746-309fc4702cc4"}
 */
function svy_mod_dialogs_global_getNonWebArgumentsArray(baseform) {

	var buttons = forms[baseform.name].buttons;

	var _a = new Array();
	_a[0] = forms[baseform.name].dialogTitle;
	_a[1] = forms[baseform.name].dialogMsg;

	var argsarray = _a.concat(buttons);

	return argsarray;
}

/**
 * Handles showing the error dialog for non web clients calling the method from the dialogs plugin.
 *
 * @private
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @param {JSForm} baseform The form created with the SolutionModel
 *
 * @returns {String} The pressed button
 *
 * @properties={typeid:24,uuid:"dff5ac35-b58c-4d3c-a4d3-e941010de1d9"}
 */
function svy_mod_dialogs_global_showErrorDialog_nonWeb(baseform) {
	var argsarray = svy_mod_dialogs_global_getNonWebArgumentsArray(baseform);
	switch (argsarray.length) {
	case 4: return plugins.dialogs.showErrorDialog(argsarray[0],argsarray[1],argsarray[2],argsarray[3]);
	break;
	case 5: return plugins.dialogs.showErrorDialog(argsarray[0],argsarray[1],argsarray[2],argsarray[3],argsarray[4]);
	break;
	case 6: return plugins.dialogs.showErrorDialog(argsarray[0],argsarray[1],argsarray[2],argsarray[3],argsarray[4],argsarray[5]);
	break;
	case 7: return plugins.dialogs.showErrorDialog(argsarray[0],argsarray[1],argsarray[2],argsarray[3],argsarray[4],argsarray[5],argsarray[6]);
	break;
	case 8: return plugins.dialogs.showErrorDialog(argsarray[0],argsarray[1],argsarray[2],argsarray[3],argsarray[4],argsarray[5],argsarray[6],argsarray[7]);
	break;
	default: return plugins.dialogs.showErrorDialog(argsarray[0],argsarray[1],argsarray[2]);
	break;
}
}

/**
 * Handles showing the info dialog for non web clients calling the method from the dialogs plugin.
 *
 * @private
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @param {JSForm} baseform The form created with the SolutionModel
 *
 * @returns {String} The pressed button
 *
 * @properties={typeid:24,uuid:"0abc408c-1205-4529-a193-fa92fa2082d1"}
 */
function svy_mod_dialogs_global_showInfoDialog_nonWeb(baseform) {
	
	var argsarray = svy_mod_dialogs_global_getNonWebArgumentsArray(baseform);
	switch (argsarray.length) {
	case 4: return plugins.dialogs.showInfoDialog(argsarray[0],argsarray[1],argsarray[2],argsarray[3]);
	break;
	case 5: return plugins.dialogs.showInfoDialog(argsarray[0],argsarray[1],argsarray[2],argsarray[3],argsarray[4]);
	break;
	case 6: return plugins.dialogs.showInfoDialog(argsarray[0],argsarray[1],argsarray[2],argsarray[3],argsarray[4],argsarray[5]);
	break;
	case 7: return plugins.dialogs.showInfoDialog(argsarray[0],argsarray[1],argsarray[2],argsarray[3],argsarray[4],argsarray[5],argsarray[6]);
	break;
	case 8: return plugins.dialogs.showInfoDialog(argsarray[0],argsarray[1],argsarray[2],argsarray[3],argsarray[4],argsarray[5],argsarray[6],argsarray[7]);
	break;
	default: return plugins.dialogs.showInfoDialog(argsarray[0],argsarray[1],argsarray[2]);
	break;
	}
	
}

/**
 * Handles showing the input dialog for non web clients calling the method from the dialogs plugin.
 *
 * @private
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @param {JSForm} baseform The form created with the SolutionModel
 *
 * @returns {String} The entered value.
 * @properties={typeid:24,uuid:"962fa9e1-4020-40b9-8a3a-3e26fdd3da55"}
 */
function svy_mod_dialogs_global_showInputDialog_nonWeb(baseform) {
	
	return plugins.dialogs.showInputDialog(forms[baseform.name].dialogTitle, forms[baseform.name].dialogMsg, forms[baseform.name].returnValue);
}

/**
 * Handles showing the question dialog for non web clients calling the method from the dialogs plugin.
 *
 * @private
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @param {JSForm} baseform The form created with the SolutionModel
 *
 * @returns {String} The pressed button
 *
 * @properties={typeid:24,uuid:"353226c9-03e7-40b9-9d90-a991fc9b5c45"}
 */
function svy_mod_dialogs_global_showQuestionDialog_nonWeb(baseform) {
	
	var argsarray = svy_mod_dialogs_global_getNonWebArgumentsArray(baseform);
	switch (argsarray.length) {
	case 4: return plugins.dialogs.showQuestionDialog(argsarray[0],argsarray[1],argsarray[2],argsarray[3]);
	break;
	case 5: return plugins.dialogs.showQuestionDialog(argsarray[0],argsarray[1],argsarray[2],argsarray[3],argsarray[4]);
	break;
	case 6: return plugins.dialogs.showQuestionDialog(argsarray[0],argsarray[1],argsarray[2],argsarray[3],argsarray[4],argsarray[5]);
	break;
	case 7: return plugins.dialogs.showQuestionDialog(argsarray[0],argsarray[1],argsarray[2],argsarray[3],argsarray[4],argsarray[5],argsarray[6]);
	break;
	case 8: return plugins.dialogs.showQuestionDialog(argsarray[0],argsarray[1],argsarray[2],argsarray[3],argsarray[4],argsarray[5],argsarray[6],argsarray[7]);
	break;
	default: return plugins.dialogs.showQuestionDialog(argsarray[0],argsarray[1],argsarray[2]);
	break;
}
}

/**
 * Handles showing the select dialog for non web clients calling the method from the dialogs plugin.
 *
 * @private
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @param {JSForm} baseform The form created with the SolutionModel
 *
 * @returns {String} The selected value.
 *
 * @properties={typeid:24,uuid:"34087bf6-579e-4f12-9193-d21179abd7c2"}
 */
function svy_mod_dialogs_global_showSelectDialog_nonWeb(baseform) {

	return plugins.dialogs.showSelectDialog(forms[baseform.name].dialogTitle, forms[baseform.name].dialogMsg, forms[baseform.name].arroptions);
}

/**
 * Handles showing the warning dialog for non web clients calling the method from the dialogs plugin.
 *
 * @private
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @param {JSForm} baseform The form created with the SolutionModel
 *
 * @returns {String} The pressed button
 *
 * @properties={typeid:24,uuid:"8d2ec5af-8c4e-485a-ad24-83552f43849c"}
 */
function svy_mod_dialogs_showWarningDialog_nonWeb(baseform) {
	var argsarray = svy_mod_dialogs_global_getNonWebArgumentsArray(baseform);
	switch (argsarray.length) {
		case 4: return plugins.dialogs.showWarningDialog(argsarray[0],argsarray[1],argsarray[2],argsarray[3]);
		break;
		case 5: return plugins.dialogs.showWarningDialog(argsarray[0],argsarray[1],argsarray[2],argsarray[3],argsarray[4]);
		break;
		case 6: return plugins.dialogs.showWarningDialog(argsarray[0],argsarray[1],argsarray[2],argsarray[3],argsarray[4],argsarray[5]);
		break;
		case 7: return plugins.dialogs.showWarningDialog(argsarray[0],argsarray[1],argsarray[2],argsarray[3],argsarray[4],argsarray[5],argsarray[6]);
		break;
		case 8: return plugins.dialogs.showWarningDialog(argsarray[0],argsarray[1],argsarray[2],argsarray[3],argsarray[4],argsarray[5],argsarray[6],argsarray[7]);
		break;
		default: return plugins.dialogs.showWarningDialog(argsarray[0],argsarray[1],argsarray[2]);
		break;
	}
}

/**
 * Creates an array with the buttons supplied as arguments
 *
 * @private
 *
 * @author Bogdan Diaconescu
 * @since 17 March 2009
 *
 * @description
 *
 * @param {Array} args The arguments array
 * @param {Number} pos Position in the arguments array where the buttons start
 *
 * @returns {Array} The buttons array
 *
 * @properties={typeid:24,uuid:"fb7f7d1a-b0e8-4fdd-8600-8cc84bb74dca"}
 */
function createArgumentsArray(args, pos) {
	var buttonsarr = new Array();

	while (args[pos]) {
		buttonsarr[pos - 2] = args[pos];
		pos++;
	}

	return buttonsarr;
}

/**
 * Shows the Error Dialog.
 *
 * @author Bogdan Diaconescu
 *
 * @since 02 March 2009
 *
 * @param {String} formTitle The from title
 * @param {String} formMessage Message to be shown on the dialog
 * @param {String} button1 Button 1 text
 * @param {...String} [buttonN] Button n text
 *
 * @returns {String} The pressed button
 *
 * @properties={typeid:24,uuid:"5358adc2-bfeb-4f4d-97d9-fa5679461650"}
 */
function svy_mod_dialogs_global_showErrorDialog(formTitle, formMessage, button1, buttonN) {
	/** @type {Array<String>}*/
	var buttonsarr = createArgumentsArray(arguments, 2);

	var baseform_name = 'errorDialog';

	var baseform

	if (solutionModel.getForm(baseform_name)) {
		solutionModel.removeForm(baseform_name)
	}
	
	baseform = svy_mod_dialogs_global_createNewForm(baseform_name);

	svy_mod_dialogs_global_createErrorDialogElements(baseform, buttonsarr.length);

	svy_mod_dialogs_global_fillErrorDialogElements(baseform, formTitle, formMessage, buttonsarr, 'Error Dialog', 'media:///Error.gif');

	return svy_mod_dialogs_global_showDialog(baseform, svy_mod_dialogs_global_showErrorDialog_nonWeb);

}

/**
 * Shows the Info Dialog.
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @param {String} formTitle The from title
 * @param {String} formMessage Message to be shown on the dialog
 * @param {String} button1 Button 1 text
 * @param {...String} [buttonN] Button N text
 *
 * @returns {String} The pressed button
 *
 * @properties={typeid:24,uuid:"eaabff62-8b17-43b6-b25b-684f8e94b6ed"}
 */
function svy_mod_dialogs_global_showInfoDialog(formTitle, formMessage, button1, buttonN) {
	/** @type {Array<String>}*/
	var buttonsarr = createArgumentsArray(arguments, 2);

	var baseform_name = 'infoDialog'

	var baseform

	if (solutionModel.getForm(baseform_name)) {
		solutionModel.removeForm(baseform_name)
	} 

	baseform = svy_mod_dialogs_global_createNewForm(baseform_name);

	svy_mod_dialogs_global_createErrorDialogElements(baseform, buttonsarr.length);

	svy_mod_dialogs_global_fillErrorDialogElements(baseform, formTitle, formMessage, buttonsarr, 'Info', 'media:///Info.gif');

	return svy_mod_dialogs_global_showDialog(baseform, svy_mod_dialogs_global_showInfoDialog_nonWeb);

}

/**
 * Shows the Input Dialog.
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @param {String} formTitle The from title
 * @param {String} formMessage Message to be shown on the dialog
 * @param {String} [defaultValue] The default value.
 *
 * @returns {String} The value entered in the textbox.
 *
 * @properties={typeid:24,uuid:"8aac14f0-374b-4547-b800-7c5a87bbf976"}
 */
function svy_mod_dialogs_global_showInputDialog(formTitle, formMessage, defaultValue) {
	var baseform_name = 'inputDialog'

	var baseform

	if (solutionModel.getForm(baseform_name)) {
		solutionModel.removeForm(baseform_name)
	} 

	baseform = svy_mod_dialogs_global_createNewForm(baseform_name);
	
	svy_mod_dialogs_global_createInputDialogElements(baseform);

	svy_mod_dialogs_global_fillInputDialogElements(baseform, formTitle, formMessage, defaultValue, 'Warning', 'media:///Question.gif');

	return svy_mod_dialogs_global_showDialog(baseform, svy_mod_dialogs_global_showInputDialog_nonWeb);
}

/**
 * Shows the Question Dialog.
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @param {String} formTitle The from title
 * @param {String} formMessage Message to be shown on the dialog
 * @param {String} button1 Button 1 text
 * @param {...String} [buttonN] Button N text
 *
 * @returns {String} The pressed button
 *
 * @properties={typeid:24,uuid:"9c0b2218-908e-4f02-97b8-0d460e28c980"}
 * @AllowToRunInFind
 */
function svy_mod_dialogs_global_showQuestionDialog(formTitle,formMessage,button1,buttonN) {
	//controller.search() - otherwise it doesn't work in find mode
	/** @type {Array<String>}*/
	var buttonsarr = createArgumentsArray(arguments, 2);

	var baseform_name = 'questionDialog_' + application.getUUID()

	var baseform

	if (solutionModel.getForm(baseform_name)) {
		solutionModel.removeForm(baseform_name)
	} 
	
	baseform = svy_mod_dialogs_global_createNewForm(baseform_name);

	svy_mod_dialogs_global_createErrorDialogElements(baseform, buttonsarr.length);

	svy_mod_dialogs_global_fillErrorDialogElements(baseform, formTitle, formMessage, buttonsarr, 'Question', 'media:///Question.gif');

	return svy_mod_dialogs_global_showDialog(baseform, svy_mod_dialogs_global_showQuestionDialog_nonWeb);

}

/**
 * Shows the Select Dialog. For the options to be displayed, use either one Array parameter or multiple String parameters.
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @param {String} formTitle The from title
 * @param {String} formMessage Message to be shown on the dialog
 * @param {Array} [options] Array containing the options to be shown.
 *
 * @param {String} [option1] String containing the option 1.
 * @param {...String} [optionN] String containing the option n.
 *
 * @returns {String} The selected option
 *
 * @properties={typeid:24,uuid:"2e2a9f9c-d5f8-4c6e-abe9-aa036fc13cd9"}
 */
function svy_mod_dialogs_global_showSelectDialog(formTitle, formMessage, options, option1, optionN) {

	var arroptions = new Array();
	/** @type {String} */
	var returnValue = '';

	if (options instanceof Array) {
		var arr = options;
		for (var i = 0; i < arr.length; i++) {
			options = options + arr[i] + '\n';
			arroptions[i] = arr[i];
			if (i == 0) returnValue = arr[i];
		}
	} else {
		var pos = 2;
		while (arguments[pos]) {
			options = options + arguments[pos] + '\n';
			arroptions[pos - 2] = arguments[pos];
			if (pos == 2) returnValue = arguments[pos];
			pos++;
		}
	}

	var baseform_name = 'selectDialog'

	var baseform

	if (solutionModel.getForm(baseform_name)) {
		solutionModel.removeForm(baseform_name)
	} 

	baseform = svy_mod_dialogs_global_createNewForm(baseform_name);

	svy_mod_dialogs_global_createSelectDialogElements(baseform, options);

	svy_mod_dialogs_global_fillSelectDialogElements(baseform, formTitle, formMessage, returnValue, 'Select', 'media:///Question.gif', options, arroptions);

	return svy_mod_dialogs_global_showDialog(baseform, svy_mod_dialogs_global_showSelectDialog_nonWeb);
}

/**
 * Shows the Warning Dialog
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @param {String} formTitle The from title
 * @param {String} formMessage Message to be shown on the dialog
 * @param {String} button1 Button 1 text
 * @param {...String} [buttonN] Button N text
 *
 * @returns {String} The pressed button
 *
 * @properties={typeid:24,uuid:"84d93084-275d-472e-9ce7-4df2bb6fd212"}
 */
function svy_mod_dialogs_global_showWarningDialog(formTitle, formMessage, button1, buttonN) {
	/** @type {Array<String>}*/	
	var buttonsarr = createArgumentsArray(arguments, 2);

	var baseform_name = 'warningDialog'

	var baseform

	if (solutionModel.getForm(baseform_name)) {
		solutionModel.removeForm(baseform_name)
	} 
	
	baseform = svy_mod_dialogs_global_createNewForm(baseform_name);
	
	svy_mod_dialogs_global_createErrorDialogElements(baseform, buttonsarr.length);

	svy_mod_dialogs_global_fillErrorDialogElements(baseform, formTitle, formMessage, buttonsarr, 'Warning', 'media:///Warning.gif');

	return svy_mod_dialogs_global_showDialog(baseform, svy_mod_dialogs_showWarningDialog_nonWeb);
}

/**
 * Shows a custom dialog. The custom form must fill the RETURNVALUE variable with the data to be returned when it is closed.
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 *
 * @param {Form} form The custom form
 * @param {Number} formX Form's X position
 * @param {Number} formY Form's Y position
 * @param {Number} formW Form's Width
 * @param {Number} formH Form's Height
 * @param {String} dialogTitle The title of the dialog
 * @param {Boolean} resizable Allow the dialog to be resized
 * @param {Boolean} showTextToolbar Show the text toolbar on the dialog
 * @param {String} windowName The name of the window
 * @param {Boolean} modal Show the dialog as modal
 * @param {String} [defaultValue] The default value
 *
 * @properties={typeid:24,uuid:"66dde400-268f-4677-beb3-5c1b8c29715b"}
 * @SuppressWarnings(unused)
 */
function svy_mod_dialogs_global_showCustomDialog(form, formX,formY,formW,formH,dialogTitle,resizable,showTextToolbar,windowName,modal,defaultValue) {

	var defValue = (defaultValue) ? defaultValue : '';

	var fname = form['_formname_'];
	var extform = solutionModel.getForm(fname);

	form = solutionModel.getForm(fname)

	form.onHide = solutionModel.getGlobalMethod("globals",'svy_mod_dialogs_global_customhide');

	if (!form.getVariable('CONTINUATION')) {
		var contvar = form.newVariable('CONTINUATION', JSVariable.TEXT);
	}
	forms[fname]['CONTINUATION'] = new Continuation();

	if (!form.getVariable('RETURNVALUE')) {
		var retvar = form.newVariable('RETURNVALUE', JSVariable.TEXT);
	}
	forms[fname]['RETURNVALUE'] = defValue;

	forms[fname].controller.recreateUI()
	globals.svy_mod_showFormInDialog(forms[fname], formX, formY, formW, formH, dialogTitle, resizable, showTextToolbar, fname, modal);

	new Continuation()
}

/**
 * @param {Form} _form
 * @param {Number} [_Xwindow]
 * @param {Number} [_Ywindow]
 * @param {Number} [_Wwindow]
 * @param {Number} [_Hwindow]
 * @param {String} [_dialogTitle]
 * @param {Boolean} [_resizable]
 * @param {Boolean} [_showTextToolbar]
 * @param {String} [_dialogName] Non modal dialogs should have a name
 * @param {Boolean} [_modal] default is true
 * @author Sanneke Aleman
 * @since 09 mei 2011
 * @
 * @properties={typeid:24,uuid:"9327D73D-58C5-4BAF-A410-D98236BF0884"}
 */
function svy_mod_showFormInDialog(_form, _Xwindow, _Ywindow, _Wwindow, _Hwindow, _dialogTitle, _resizable, _showTextToolbar, _dialogName, _modal) {
	var _win
	
	if(_modal == undefined) _modal = true
	
	
	//if the dialog is not modal it needs to have a unique name, could be opened multiple times
	if(!_dialogName && _modal == false)
	{
		_dialogName = 'nonModelDialog' + application.getUUID()
	}
	else if(!_dialogName) //infoDialog is reused for modal windows without name
	{
		_dialogName = 'infoDialog' + _form
	}
	
	if(application.getWindow(_dialogName))
	{
		_win = application.getWindow(_dialogName)
	}
	else
	{
		_win = application.createWindow(_dialogName,_modal ? JSWindow.MODAL_DIALOG : JSWindow.DIALOG);
		if(_Xwindow && _Ywindow && _Wwindow && _Hwindow)
			_win.setInitialBounds(_Xwindow,_Ywindow,_Wwindow,_Hwindow)
		// MA aggiunta il 14/04/2015 da Giovanni 
		else if(_Wwindow && _Hwindow)
			_win.setSize(_Wwindow,_Hwindow)
		
	}
	if(_resizable!= undefined)_win.resizable = _resizable
	
	if(_dialogTitle)
	{
		_win.title = _dialogTitle
	}	
	if(_showTextToolbar)
	{
		_win.showTextToolbar(_showTextToolbar)
	}
	_win.show(_form)
}

/**
 *	@param {JSEvent} _event
 * 
 *
 * @properties={typeid:24,uuid:"EEBCA54A-71AE-44E5-A33D-695B625216C2"}
 */
function svy_mod_closeForm(_event)
{
	var _formname =  _event.getFormName() || _event.data['formname'];
	var _context = forms[_formname].controller.getFormContext()
	/** @type {String} */
	var _window = _context.getValue(1,1)
	if(application.getWindow(_window))
	{
		var _windowObject = application.getWindow(_window)
		_windowObject.hide()
		
		if(_window != 'infoDialog') //infoDialog is reused
		{
			_windowObject.destroy()			
		}		
	}
}

/**
 * 
 * @param {String} fm The form created with the SolutionModel
 * @param {Boolean} [modal]
 * @param {Number} [width]
 * @param {Number} [height]
 * @param {String} [title]
 * 
 * @properties={typeid:24,uuid:"A0A8B614-7D96-4CD8-B564-BA8A6D1D7AFC"}
 */
function svy_mod_dialogs_showBlockingDialog(fm, modal, width, height, title)
{
	forms[fm]['dialogName'] = fm;
	forms[fm]['dialogTitle'] = title;
	forms[fm]['returnValue'] = null;
	
	if (application.getApplicationType() == APPLICATION_TYPES.WEB_CLIENT) 
	{
		var dialogContinuation = new Continuation();
		forms[fm]['dialogContinuation'] = dialogContinuation;
		globals.svy_mod_showFormInDialog(forms[fm], -1, -1, width, height, title, false, false, fm, modal);
		SVY_MOD_DIALOG_TERMINATOR();
	}
	else
	{
		return globals.svy_mod_showFormInDialog(forms[fm], -1, -1, width, height, title, false, false, fm, modal);
	}
	
	return null;
}
