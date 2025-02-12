/******************************************************
 *          EXTJS FORM UTIL                           *  
 * ****************************************************/
//-- Global
var utilServlet="Utils";
var rootFolder="../../";
var numberColsField=7;
var numberColsForm;
var supportToolbars=new Array();

var barProgress;

var gisClientError="";
//--- New vtype definition

var _formObj_=new Array();

var popup;


function generateFormFieldSet(title, fieldSets, numCol, localizationObj){
  var newForm;
  var arrayFieldSet=generateListOfFieldSet(fieldSets, numCol, localizationObj);

  newForm = new Ext.FormPanel({
        frame: true,
        title: title,
        autoShow : true,
        width: '100%',
        items:arrayFieldSet
    });
  var result={fieldSetArray: arrayFieldSet, form: newForm};
  return(result);
    
}

function createPanelExjFormByXml(xmlDocument,lang){

  _formObj_.push({onChangeFieldControlMandatory:function(){}});  
  var contentFormPanel, tabPanel, forms=null, idElementTabs=null;  
  var formObjCreated, fieldSetForms= new Array();
  var controlMandatoryButtons= new Array();
  forms= new Array();
  var fieldSetConfValues=new Array();
  var inputInterfaceXml;
  

  inputInterfaceXml=new XmlDoc(xmlDocument,"xmlns:gis='http://gisClient.pisa.intecs.it/gisClient'");


 var loc=null;
 if(inputInterfaceXml.selectNodes("/gis:inputInterface")[0].getAttribute("localization")){
    var localizationControl=inputInterfaceXml.selectNodes("/gis:inputInterface")[0].getAttribute("localization");
    if(localizationControl == 'yes'){
        var localizationPath=inputInterfaceXml.selectNodes("/gis:inputInterface")[0].getAttribute("pathLocalization");
        loc=new localization(localizationPath+lang+".xml");
    }
 }
  var panels;
  var buttonElements= new Array();
  var requestInformationsNodes=inputInterfaceXml.selectNodes("/gis:inputInterface/gis:requestInformations");
  var backgroundColor;
  if(requestInformationsNodes.length > 0){
    backgroundColor=requestInformationsNodes[0].getAttribute("backgroundColor");  
    if(!backgroundColor)
       backgroundColor='#99bbe8';
    buttonElements=inputInterfaceXml.selectNodes("/gis:inputInterface/gis:requestInformations/gis:buttons/gis:button");     
      var type,onclickFunction,disabled,disableIfNotMandatoryFields;  
      var contentButtonPanel,textButton;

      if(buttonElements.length>0){
        var buttons= new Array();  
        for(i=0;i<buttonElements.length;i++){
           disabled=buttonElements[i].getAttribute("disabled");  
           onclickFunction=buttonElements[i].getAttribute("onclick"); 

           disableIfNotMandatoryFields=buttonElements[i].getAttribute("disableIfNotMandatoryFields");
           if(disableIfNotMandatoryFields){
             controlMandatoryButtons.push(buttonElements[i].getAttribute("id"));
             disabled=true;
           }   

           if(loc){
             textButton=loc.getLocalMessage(buttonElements[i].getAttribute("label"));  
           }else
             textButton=buttonElements[i].getAttribute("label");

            buttons[i]=new Ext.Button({
                              id: buttonElements[i].getAttribute("id"),  
                              text: textButton,
                              handler: eval(onclickFunction),
                              disabled: disabled,
                              icon:buttonElements[i].getAttribute("icon")
                              });
        }   
        contentButtonPanel=new Ext.Panel({
            border:false,
            layout: 'table',
            layoutConfig: {
                         columns: buttonElements.length
                      },
            enableTabScroll:false,
            bodyStyle : {background: backgroundColor},
            buttons: buttons,
            //items: buttons,
            html: "",
            closable:false});
     }
  }else
    backgroundColor='#99bbe8';
    
      
  
 
 var sectionInterfaceElements;

    sectionInterfaceElements=
               inputInterfaceXml.selectNodes("/gis:inputInterface/gis:section");      
  if(sectionInterfaceElements.length >1){
    var nameTab,cols;
    idElementTabs= new Array();
    var items= new Array();
    
    for(var i=0;i<sectionInterfaceElements.length;i++){
        nameTab =sectionInterfaceElements[i].getAttribute("name"); 
        cols =sectionInterfaceElements[i].getAttribute("cols"); 
        if(!cols)
            cols=numberColsField;
        else
          cols=cols*numberColsField;
        numberColsForm=cols;
        idElementTabs[i]=nameTab+"Div";
        items[i]={
              id: nameTab,
              title: nameTab,
              enableTabScroll:true,
              autoScroll:true,
              html: "<div id='"+idElementTabs[i]+"'></div>",
              closable:false
        };
       formObjCreated=createExjFormByElement("",sectionInterfaceElements[i],cols,loc);

       fieldSetConfValues.push(formObjCreated.valuesControl);
       forms[i]= formObjCreated.formFieldSet;
       fieldSetForms[i]=formObjCreated.fieldSetList;
    }    
    tabPanel=new Ext.TabPanel({
        activeTab: 0,
       /*/ minTabWidth: 115,
        tabWidth:135,*/
        enableTabScroll:true,
        defaults: {autoScroll:true},
        items: items
    });  
  }else{
      if(sectionInterfaceElements.length== 0)
          tabPanel=new Ext.Panel({
       html:"",
        closable:false});
    else{
   idElementTabs= new Array();   
   nameTab =sectionInterfaceElements[0].getAttribute("name"); 
   cols =sectionInterfaceElements[0].getAttribute("cols");
   if(!cols)
          cols=numberColsField;
        else
          cols=cols*numberColsField;
   numberColsForm=cols;
   idElementTabs[0]=nameTab+"Div";
   var  item={
              id: nameTab,
              //title: nameTab,
              enableTabScroll:true,
              autoScroll:true,
              html: "<div id='"+idElementTabs[0]+"'></div>",
              closable:false
        };
    formObjCreated=createExjFormByElement("",sectionInterfaceElements[0],cols,loc);
    fieldSetConfValues.push(formObjCreated.valuesControl);
    forms[0]=formObjCreated.formFieldSet;
    fieldSetForms[0]=formObjCreated.fieldSetList;
   
    tabPanel=new Ext.Panel({
        items: [item],
        closable:false});
    }
  }
                      

  if(buttonElements.length>0){
    panels=[tabPanel,contentButtonPanel];  
  }else{
    panels=[tabPanel]; 
    contentButtonPanel=null;
  } 

  contentFormPanel=new Ext.Panel({
        autoScroll: true,
        border:false,
        bodyStyle : {background: backgroundColor},
        items: panels
  }); 
  var outputManager;
  var outputInformationElements=inputInterfaceXml.selectNodes("/gis:inputInterface/gis:outputInformations");
  if(outputInformationElements.length>0){  
     outputManager= getOutputMangerByElement(outputInformationElements[0]);
  }   
  else
     outputManager=null; 
 
  _formObj_[_formObj_.length-1]={
                formsPanel: contentFormPanel,
                formsTab: tabPanel,
                buttonPanel: contentButtonPanel,
                formsArray: forms,
                formsFieldSetArray: fieldSetForms,
                tabElementsId: idElementTabs,
                confValues: fieldSetConfValues,
                responseType: "",
                controlMandatoryButtons : controlMandatoryButtons,
                outputManager: outputManager,
                onChangeFieldControlMandatory: function (){
                  var xtypeArray,i,u,j,input;
                  xtypeArray=["textfield","combo","datefield","numberfield","checkbox"];
                  for(i=0; i<this.formsArray.length; i++ ){
                      for(u=0; u<xtypeArray.length; u++){
                         input=this.formsArray[i].findByType(xtypeArray[u]); 
                         for(j=0; j<input.length; j++){
                             if(!input[j].validate()){
                                for(i=0;i<this.controlMandatoryButtons.length;i++)
                                  for(u=0; u<this.buttonPanel.buttons.length; u++){
                                    this.buttonPanel.buttons[u].disable(); 
                                  }  
                                return(false);  
                             }
                             else{
                                 
                               if((input[j].allowBlank == false)||(input[j].allowBlank == 'false')){ 
                                  if(!input[j].getValue() || input[j].getValue()==""){
                                     for(i=0;i<this.controlMandatoryButtons.length;i++)
                                        for(u=0; u<this.buttonPanel.buttons.length; u++){
                                          this.buttonPanel.buttons[u].disable(); 
                                        }  
                                    return(false);  
                                 }
                              }  
                             }    
                                            
                         }
                      }
                    }
                  for(i=0;i<this.controlMandatoryButtons.length;i++){
                      for(u=0; u<this.buttonPanel.buttons.length; u++){
                          if(this.buttonPanel.buttons[u].id == this.controlMandatoryButtons[i])
                             this.buttonPanel.buttons[u].enable(); 
                      }
                  }  
                  return(true);  
                },
                isEmpty: function(){
                  var result=true;
                  var i,u;
                  var values=this.getFormValues();
                  for(i=0; i<this.formsArray.length; i++ ){
                      for(u=0; u<this.confValues[i].length; u++){
                          if( (values[this.confValues[i][u].id])!=null && values[this.confValues[i][u].id]!='')
                              if(values[this.confValues[i][u].id] instanceof Object){
                                if(values[this.confValues[i][u].id].minValue!=null && values[this.confValues[i][u].id].minValue!='')
                                    if(values[this.confValues[i][u].id].startDate!=null && values[this.confValues[i][u].id].startDate!='')  
                                        return false;       
                              }else 
                                return false;
                      } 
                  }  
                  return result;
                    
                },
                getDimFormPanel: function(){
                    return contentFormPanel.getSize();
                },
                destroy: function (){
                   this.formsTab.destroy();
                   if(this.buttonPanel)
                      this.buttonPanel.destroy();
                   this.formsPanel.destroy(); 
                },
               /* render: function(){
                    var a,b;
                      if(this.formsArray.length > 1){
                        for(var i=0; i<this.formsArray.length;i++){
                          this.formsTab.setActiveTab(i);                
                          this.formsArray[i].render(document.getElementById(this.tabElementsId[i])); 
                          a=this.formsArray[i].getSize();
                        
                        }
                        this.formsTab.setActiveTab(0);
                      }else{
                          if(this.formsArray.length == 1){
                            this.formsArray[0].render(document.getElementById(this.tabElementsId[0]));
                           
                         }
                         
                     
                      }
                     
                    for(var u=0;u<supportToolbars.length;u++){
                      supportToolbars[u].toolbar.render(supportToolbars[u].id);
                 
                     
                      //var toc2 = new WebGIS.Control.Toc({map: mapTool, parseWMS: false, autoScroll: true});
                      for(var j=0; j<supportToolbars[u].buttons.length; j++){
                          if(supportToolbars[u].toolbar.items.length < supportToolbars[u].buttons.length){
                            var button=eval(supportToolbars[u].buttons[j]);
                            supportToolbars[u].toolbar.add(button);
                            supportToolbars[u].toolbar.doLayout();
                          }
                      }
                
                    }
                    
                },*/
                render: function(){
                      var elementRend;
                      var activeTabId=null;
                      if(this.formsTab.activeTab)
                         activeTabId=this.formsTab.activeTab;
                      if(this.formsArray.length > 1){
                        for(var i=0; i<this.formsArray.length;i++){
                          this.formsTab.setActiveTab(i);

                          elementRend=document.getElementById(this.tabElementsId[i]);
                          
                          if(elementRend)
                              if(elementRend.innerHTML!=""){
                                this.formsTab.setWidth(this.formsPanel.getWidth());
                                this.formsTab.doLayout();
                                this.formsArray[i].setWidth(this.formsPanel.getWidth());
                                this.formsArray[i].doLayout();
                              }else{
                                this.formsArray[i].render(elementRend);
                                this.formsArray[i].doLayout();
                              }
                          else return;
              
                        }
                        if(activeTabId)
                            this.formsTab.setActiveTab(activeTabId);
                        else
                            this.formsTab.setActiveTab(0);
                      }else{
                          elementRend=document.getElementById(this.tabElementsId[0]);
                          if(elementRend)
                              if(elementRend.innerHTML!="")
                                  this.formsArray[0].doLayout();
                              else{
                                 this.formsArray[0].render(elementRend);

                                 this.formsArray[0].doLayout();
                             }
                          else return;
                   

                      }
                     
                    for(var u=0;u<supportToolbars.length;u++){
                      supportToolbars[u].toolbar.render(supportToolbars[u].id);

                      for(var j=0; j<supportToolbars[u].buttons.length; j++){
                          if(supportToolbars[u].toolbar.items.length < supportToolbars[u].buttons.length){
                            var button=eval(supportToolbars[u].buttons[j]);
                            supportToolbars[u].toolbar.add(button);
                            supportToolbars[u].toolbar.doLayout();
                          }
                      }
     
                    }
                    this.formsTab.doLayout();
                    Ext.QuickTips.init();
                },
                resetFormValues: function(){
                   var xtypeArray=["textfield","combo","datefield","numberfield","checkbox"];
                   var input,i,u,j;
                   for(i=0; i<this.formsArray.length; i++ ){
                      for(u=0; u<xtypeArray.length; u++){
                         input=this.formsArray[i].findByType(xtypeArray[u]); 
                         for(j=0; j<input.length; j++){
                             if( !input[j].disabled )
                             input[j].setValue("");          
                         }
                      }
                    }  
                },
                resetCurrentSectionValues: function(){
                   var idTable=this.formsTab.getActiveTab().getItemId().split('-');
                   var current=idTable[1];
                   var u,j,input;
                   for(u=0; u<this.xtypeArray.length; u++){
                         input=this.formsArray[current].findByType(this.xtypeArray[u]);
                         for(j=0; j<input.length; j++){
                             if( !input[j].disabled )
                             input[j].setValue("");
                         }
                      }
                },
                setDefaultValues: function (values){
                  var field,type,i,u;
                   for(i=0; i<this.formsArray.length; i++ ){
                      for(u=0; u<this.confValues[i].length; u++){
                         field=this.formsArray[i].getForm().findField(this.confValues[i][u].id); 
                         type=this.confValues[i][u].type;
                       
                           
                         if(this.confValues[i][u].id!="idRequest")   
                           switch(type) {
                            case "text":
                                     field.setValue(values[this.confValues[i][u].id]); 
                                    break; 
                            case "password":
                                     field.setValue(values[this.confValues[i][u].id]); 
                                    break;        
                            case "label":
                                      if(values[this.confValues[i][u].id])
                                        field.setValue(values[this.confValues[i][u].id]); 
                                    break; 
                                    
                            case "numeric":
                                   
                                    field.setValue(values[this.confValues[i][u].id]); 
                                    break;
                            case "checkbox":
                                    field.setValue(values[this.confValues[i][u].id]); 
                                    break;        

                            case "combo":
                                   
                                    field.enable();
                                    field.store=values[this.confValues[i][u].id].store;
                                    field.setValue(values[this.confValues[i][u].id].value); 
                                    break;

                            case "bbox":
                                  
                                    var split=values[this.confValues[i][u].id].split(',');
                                    this.formsArray[i].getForm().findField(this.confValues[i][u].id+'WestBBOX').setValue(split[0]); 
                                    this.formsArray[i].getForm().findField(this.confValues[i][u].id+'SouthBBOX').setValue(split[1]); 
                                    this.formsArray[i].getForm().findField(this.confValues[i][u].id+'EastBBOX').setValue(split[2]); 
                                    this.formsArray[i].getForm().findField(this.confValues[i][u].id+'NorthBBOX').setValue(split[3]); 
                                    //Disegnare Area .....
                                    break;          

                            case "rangedate":
                                    var range=values[this.confValues[i][u].id];
                                    this.formsArray[i].getForm().findField(this.confValues[i][u].id+'StartDate').setValue(range.startDate); 
                                    this.formsArray[i].getForm().findField(this.confValues[i][u].id+'EndDate').setValue(range.endDate); 
                                    break;
                            case "date":
                                    field.setValue(values[this.confValues[i][u].id]); 
                                    break;     
                            case "time":
                                  
                                    var timeSplit=values[this.confValues[i][u].id].split('-'); 
                                    this.formsArray[i].getForm().findField('h'+this.confValues[i][u].id).setValue(timeSplit[0]);
                                    this.formsArray[i].getForm().findField('m'+this.confValues[i][u].id).setValue(timeSplit[1]);
                                    this.formsArray[i].getForm().findField('s'+this.confValues[i][u].id).setValue(timeSplit[2]);
                                    this.formsArray[i].getForm().findField('ms'+this.confValues[i][u].id).setValue(timeSplit[3]);
                                    break;
                            case "rangetime":
                                
                                    var timeSplitStart=values[this.confValues[i][u].id].startTime.split('-'); 
                                    var timeSplitEnd=values[this.confValues[i][u].id].endTime.split('-'); 
                                    this.formsArray[i].getForm().findField('hStart'+this.confValues[i][u].id).setValue(timeSplitStart[0]);
                                    this.formsArray[i].getForm().findField('mStart'+this.confValues[i][u].id).setValue(timeSplitStart[1]);
                                    this.formsArray[i].getForm().findField('hEnd'+this.confValues[i][u].id).setValue(timeSplitEnd[0]);
                                    this.formsArray[i].getForm().findField('mEnd'+this.confValues[i][u].id).setValue(timeSplitEnd[1]);
                                    break;
                          }
                      }
                    }                      
                },
                getResponseType: function(){
                  if(this.responseType == "")
                      this.getFormValues();
                  return this.responseType;
                },
                setFormPanelDDEvent: function(ddGroup,index,fields){
                  var formPanelDropTargetEl =  this.formsArray[index].body.dom;
                  var formPanel=this.formsArray[index];
     

                  var formPanelDropTarget = new Ext.dd.DropTarget(formPanelDropTargetEl, {
                        ddGroup     : ddGroup,
                        notifyEnter : function(ddSource, e, data) {
                                formPanel.body.stopFx();
                                formPanel.body.highlight();
                        },
                        notifyDrop  : function(ddSource, e, data){
                          
                            var selectedRecord = ddSource.dragData.selections[0];
                            var currentField,currentFiledType,fieldLabelValue;
                            for(var i=0; i<fields.length; i++ ){
                              
                                currentField=formPanel.getForm().findField(fields[i]);
                                currentFiledType=currentField.getXType();
                              
                                if(currentFiledType == "field"){
                                   fieldLabelValue=currentFiledType.getValue();
                                   fieldLabelValue+="<p><b>"+currentField.storeAttribute+": </b> <br><br> "+selectedRecord.data[currentField.storeAttribute]+"</p></br>";
                                }else
                                    currentField.setValue(selectedRecord.data[currentField.storeAttribute]);
                            }
                           return(true);
                        }
                  });

                },
                setFieldsDDEvent: function(ddGroup,index,fields){
                    alert("not yet implemented");

                },
                setFieldSetDDEvent: function(index,fields, fieldValues){
                   var filedSetsElement= new Array();
                   var fieldSets= new Object(), fieldSetsInputs= new Object();
                   var fieldSetsInputValues= new Object();
                   var fieldSetDropTargets= new Array();
                   var formPanel=this.formsArray[index];
                   for(var i=0; i<this.formsFieldSetArray[index].length; i++){
                       filedSetsElement[i]=this.formsFieldSetArray[index][i].body.dom;
                       fieldSets[this.formsFieldSetArray[index][i].ddGroup]=this.formsFieldSetArray[index][i];
                       fieldSetsInputs[this.formsFieldSetArray[index][i].ddGroup]=fields[i];
                       if(fieldValues)
                        fieldSetsInputValues[this.formsFieldSetArray[index][i].ddGroup]=fieldValues[i];
                       else
                        fieldSetsInputValues[this.formsFieldSetArray[index][i].ddGroup]=null;
                        fieldSetDropTargets[i]=new Ext.dd.DropTarget(filedSetsElement[i], {
                                ddGroup     : this.formsFieldSetArray[index][i].ddGroup,
                                notifyEnter : function(ddSource, e, data) {
                                    //Add some flare to invite drop.
                                    fieldSets[this.ddGroup].body.stopFx();
                                    fieldSets[this.ddGroup].body.highlight();
                                },
                                notifyDrop  : function(ddSource, e, data){
                                    var selectedRecord = ddSource.dragData.selections[0];
                                    var currentField,currentFiledType,fieldLabelValue;
                                    for(var u=0; u<fieldSetsInputs[this.ddGroup].length; u++ ){
                                        currentField=formPanel.getForm().findField(fieldSetsInputs[this.ddGroup][u]);
                                        currentFiledType=currentField.getXType();
                                        if(currentFiledType == "field"){
                                            var valueStore;
                                             if(fieldSetsInputValues[this.ddGroup][u])
                                                 valueStore=fieldSetsInputValues[this.ddGroup][u];
                                             else
                                                 valueStore=selectedRecord.data[currentField.storeAttribute];
                                             //ANDREA: Vedere come aggiornare la lista dei valori
                                            
                                             var elementLabel=document.getElementById(currentField.divContent);
                                             var fieldLabelValueElement=document.createElement("div");
                                             fieldLabelValueElement.setAttribute("id", valueStore);
                                             
                                            elementLabel.appendChild(fieldLabelValueElement);
                                            fieldLabelValueElement=document.getElementById(valueStore);
                                            fieldLabelValueElement.innerHTML="<p><b>"+currentField.storeAttribute+": </b>&nbsp;&nbsp;  "+
                                                                valueStore+"&nbsp;&nbsp;&nbsp; <a href=\"javascript:removeElement(\'"+currentField.divContent+"\',\'"+valueStore+"\');\">remove</a></p></br>";
                                        }else
                                           if(fieldSetsInputValues[this.ddGroup][u])
                                                currentField.setValue(fieldSetsInputValues[this.ddGroup][u]);
                                           else
                                                currentField.setValue(selectedRecord.data[currentField.storeAttribute]);
                                    }
                           return(true);
                        }
                     });
                  }
                },
                getFormValues: function(label){
                  var xtypeArray;
                  xtypeArray=["textfield","textarea", "combo","datefield","numberfield","checkbox","field","checkboxgroup","spinnerfield"];
                  var input,i,u,j;
                  var idRequest="";
                  var formValues=new Array();
                  var complexValues=new Array();
                  for(i=0; i<this.formsArray.length; i++ ){
                      for(u=0; u<xtypeArray.length; u++){
                         input=this.formsArray[i].findByType(xtypeArray[u]);
                         for(j=0; j<input.length; j++){
                             if(!input[j].validate())
                                return(null);

                             if((xtypeArray[u] == "combo") && label)
                                 formValues[input[j].getItemId()]={
                                          id: input[j].getItemId(),
                                          value:input[j].getValueInformation('value'),
                                          store: input[j].store
                                      };
                             else
                                if(xtypeArray[u] == "combo")
                                  formValues[input[j].getItemId()]={
                                                  id: input[j].getItemId(),
                                                  value:input[j].getValueInformation('value')
                                              };
                             else
                               if(xtypeArray[u] == "checkboxgroup") {
                                    formValues[input[j].getItemId()]={
                                              id: input[j].getItemId(),
                                              value:""
                                    };
                                   var checkgroupvalue="";
                                   var control=false;
                                   for(var kk=0; kk<input[j].items.length; kk++){
                                       if(input[j].items.items[kk].checked){
                                           checkgroupvalue+=input[j].items.items[kk].name+",";
                                           control=true;
                                       }
                                   }
                                    if(control)
                                        formValues[input[j].getItemId()].value=checkgroupvalue;

                                 }
                               else
                                 if(xtypeArray[u] == "field") {
                                     if(input[j].fieldType == "editarea")
                                        formValues[input[j].getItemId()]={
                                              id: input[j].getItemId(),
                                              value:input[j].getEditorValue()
                                          };
                                     else
                                        if(label)
                                            formValues[input[j].getItemId()]={
                                              id: input[j].getItemId(),
                                              value:input[j].value
                                           };
                                 }else{
                                    formValues[input[j].getItemId()]={
                                                  id: input[j].getItemId(),
                                                  value:input[j].getValue()
                                              };
                                 }
                             if(input[j].getItemId() == "outputFormat")
                                this.responseType=input[j].getValue();
                         }
                      }
                    }
                  formValues["idRequest"]="";
                  var tempform,tempFormat,tempTime1,tempTime2;

                  for(i=0;i<this.confValues.length;i++){
                     tempform=this.confValues[i];

                     for(u=0;u<tempform.length;u++){

                        switch(tempform[u].type) {
                          case "text":
                                    if(formValues[tempform[u].id].value){
                                        complexValues[tempform[u].id]=formValues[tempform[u].id].value;
                                        idRequest+=formValues[tempform[u].id].value;
                                    }else
                                        complexValues[tempform[u].id]=null;
                                  break;
                          case "password":
                                   // if(formValues[tempform[u].id].value){
                                        complexValues[tempform[u].id]=formValues[tempform[u].id].value;
                                        idRequest+=formValues[tempform[u].id].value;
                                   // }else
                                     //   complexValues[tempform[u].id]=null;
                                  break;
                          case "label":
                                  if(label)
                                    if(formValues[tempform[u].id].value ){
                                        complexValues[tempform[u].id]=formValues[tempform[u].id].value;
                                       // idRequest+=formValues[tempform[u].id].value;
                                    }else
                                        complexValues[tempform[u].id]=null;
                                  break;
                          case "textarea":
                                    if(formValues[tempform[u].id].value){
                                        complexValues[tempform[u].id]=formValues[tempform[u].id].value;
                                        idRequest+=formValues[tempform[u].id].value;
                                    }else
                                        complexValues[tempform[u].id]=null;
                                  break;
                          case "editarea":
                                    if(formValues[tempform[u].id].value){
                                        complexValues[tempform[u].id]=formValues[tempform[u].id].value;
                                        idRequest+=formValues[tempform[u].id].value;
                                    }else
                                        complexValues[tempform[u].id]=null;
                                  break;
                          case "numeric":
                                  
                                  if(formValues[tempform[u].id].value || formValues[tempform[u].id].value== 0){
                                      complexValues[tempform[u].id]=formValues[tempform[u].id].value;
                                      idRequest+=formValues[tempform[u].id].value;
                                    }
                                  else
                                      complexValues[tempform[u].id]='0';
                                  
                                  break;
                          case "spinner":

                                  if(formValues[tempform[u].id].value || formValues[tempform[u].id].value== 0){
                                      complexValues[tempform[u].id]=formValues[tempform[u].id].value;
                                      idRequest+=formValues[tempform[u].id].value;
                                    }
                                  else
                                      complexValues[tempform[u].id]='0';
                                  
                                  break;
                          case "checkbox":
                                  
                                  if(formValues[tempform[u].id].value){
                                      complexValues[tempform[u].id]=formValues[tempform[u].id].value;
                                      idRequest+=formValues[tempform[u].id].value;
                                    }
                                  else
                                      complexValues[tempform[u].id]=null;
                                  
                                  break;
                          case "checkboxgroup":

                                  

                                  if(formValues[tempform[u].id].value){
                                      complexValues[tempform[u].id]=replaceAll(formValues[tempform[u].id].value,"__",',');
                                      
                                      idRequest+=formValues[tempform[u].id].value;
                                    }
                                  else
                                      complexValues[tempform[u].id]=null;
                                  
                                  break;

                          case "combo":
                                  
                                  if(formValues[tempform[u].id].value){
                                     if(!label){
                                       complexValues[tempform[u].id]=formValues[tempform[u].id].value;
                                      idRequest+=formValues[tempform[u].id].value;
                                     }else{

                                        complexValues[tempform[u].id]={
                                                              value:formValues[tempform[u].id].value,
                                                              store: formValues[tempform[u].id].store
                                                            };
                                     }

                                    }
                                  else
                                      complexValues[tempform[u].id]=null;
                                  
                                  break;

                          case "bbox":
                                 
                                  if((formValues[tempform[u].id+'WestBBOX'].value != '')&&
                                     (formValues[tempform[u].id+'EastBBOX'].value != '')&&
                                     (formValues[tempform[u].id+'NorthBBOX'].value != '')&&
                                     (formValues[tempform[u].id+'SouthBBOX'].value != '')&&
                                     (formValues[tempform[u].id+'WestBBOX'].value > -180)&&
                                     (formValues[tempform[u].id+'EastBBOX'].value > -180)&&
                                     (formValues[tempform[u].id+'NorthBBOX'].value > -90)&&
                                     (formValues[tempform[u].id+'SouthBBOX'].value > -90))
                                    {
                                      tempFormat=tempform[u].format;
                                      tempFormat = tempFormat.replace("W",
                                        formValues[tempform[u].id+'WestBBOX'].value);
                                      tempFormat = tempFormat.replace("E",
                                        formValues[tempform[u].id+'EastBBOX'].value);
                                      tempFormat = tempFormat.replace("N",
                                        formValues[tempform[u].id+'NorthBBOX'].value);
                                      tempFormat = tempFormat.replace("S",
                                        formValues[tempform[u].id+'SouthBBOX'].value);
                                      complexValues[tempform[u].id]=tempFormat;
                                      idRequest+=tempFormat;
                                  }else
                                    complexValues[tempform[u].id]=null;
                                 
                                  break;

                          case "numericRange":
                                  
                                  if(formValues[tempform[u].id+'MinValue'].value || formValues[tempform[u].id+'MinValue'].value == 0 &&
                                      formValues[tempform[u].id+'MaxValue'].value || formValues[tempform[u].id+'MinValue'].value == 0){
                                     
                                      complexValues[tempform[u].id]={
                                          minValue: formValues[tempform[u].id+'MinValue'].value,
                                          maxValue: formValues[tempform[u].id+'MaxValue'].value
                                      };
                                      
                                    idRequest+=complexValues[tempform[u].id].minValue;
                                    idRequest+=complexValues[tempform[u].id].maxValue;
                                  }else
                                    complexValues[tempform[u].id]=null;
                                  
                                  break;
                          case "rangedate":
                                  if(formValues[tempform[u].id+'StartDate'].value &&
                                      formValues[tempform[u].id+'EndDate'].value){
                                      complexValues[tempform[u].id]={
                                          startDate: formValues[tempform[u].id+'StartDate'].value.format(tempform[u].format),
                                          endDate: formValues[tempform[u].id+'EndDate'].value.format(tempform[u].format)
                                      };
                                    idRequest+=complexValues[tempform[u].id].startDate;
                                    idRequest+=complexValues[tempform[u].id].endDate;
                                  }else
                                    complexValues[tempform[u].id]=null;
                                  break;
                          case "date":
                                  if(formValues[tempform[u].id].value){
                                      if(!label){
                                          complexValues[tempform[u].id]=formValues[tempform[u].id].value.format(tempform[u].format);
                                          idRequest+=formValues[tempform[u].id].value.format(tempform[u].format);

                                      }else
                                          complexValues[tempform[u].id]=formValues[tempform[u].id].value;
                                  }else
                                    complexValues[tempform[u].id]=null;

                                  break;
                          case "time":
                                      if(formValues['h'+tempform[u].id].value &&
                                         formValues['m'+tempform[u].id].value  /*&&
                                         formValues['s'+tempform[u].id].value &&
                                         formValues['ms'+tempform[u].id].value*/){
                                         if(!label){
                                              tempFormat=tempform[u].format;
                                              tempTime1=tempFormat.replace("H", formValues['h'+tempform[u].id].value);
                                              tempTime1=tempTime1.replace("h", formValues['h'+tempform[u].id].value);
                                              tempTime1=tempTime1.replace("m", formValues['m'+tempform[u].id].value);

                                              if(formValues['s'+tempform[u].id])
                                                 if(!formValues['s'+tempform[u].id].value){
                                                     formValues['s'+tempform[u].id].value="00";
                                                     tempTime1=tempTime1.replace("s", formValues['s'+tempform[u].id].value);
                                                 }
                                               if(formValues['ms'+tempform[u].id])
                                                 if(!formValues['ms'+tempform[u].id].value){
                                                    formValues['ms'+tempform[u].id].value="000";
                                                    tempTime1=tempTime1.replace("ms", formValues['ms'+tempform[u].id].value);
                                                 }
                                              complexValues[tempform[u].id]=tempTime1;
                                              idRequest+=complexValues[tempform[u].id];
                                         }else{
                                             complexValues[tempform[u].id]=formValues['h'+tempform[u].id].value+"-"+
                                                                  formValues['m'+tempform[u].id].value;
                                             if(formValues['s'+tempform[u].id])
                                                complexValues[tempform[u].id]+="-"+formValues['s'+tempform[u].id].value;
                                             if(formValues['ms'+tempform[u].id])
                                                complexValues[tempform[u].id]+="-"+formValues['ms'+tempform[u].id].value;
                                         }

                                      }else
                                        complexValues[tempform[u].id]=null;

                                  break;
                          case "rangetime":
                              
                                  if(formValues['hStart'+tempform[u].id].value &&
                                     formValues['mStart'+tempform[u].id].value  &&
                                     formValues['hEnd'+tempform[u].id].value &&
                                     formValues['mEnd'+tempform[u].id].value){
                                      if(!label){
                                          tempFormat=tempform[u].format;
                                          tempTime1=tempFormat.replace("H", formValues['hStart'+tempform[u].id].value);
                                          tempTime1=tempTime1.replace("h", formValues['hStart'+tempform[u].id].value);
                                          tempTime1=tempTime1.replace("i", formValues['mStart'+tempform[u].id].value);
                                          tempTime1=tempTime1.replace("s", formValues['sStart'+tempform[u].id].value);
                                          tempTime2=tempFormat.replace("H", formValues['hEnd'+tempform[u].id].value);
                                          tempTime2=tempTime2.replace("h", formValues['hEnd'+tempform[u].id].value);
                                          tempTime2=tempTime2.replace("i", formValues['mEnd'+tempform[u].id].value);
                                          tempTime2=tempTime2.replace("s", formValues['sEnd'+tempform[u].id].value);
                                          complexValues[tempform[u].id]={
                                              startTime: tempTime1,
                                              endTime: tempTime2
                                          };
                                          idRequest+=complexValues[tempform[u].id].startTime;
                                          idRequest+=complexValues[tempform[u].id].endTime;
                                      }else{
                                        complexValues[tempform[u].id]={
                                              startTime: formValues['hStart'+tempform[u].id].value+"-"+
                                                                  formValues['mStart'+tempform[u].id].value+"-",
                                              endTime: formValues['hEnd'+tempform[u].id].value+"-"+
                                                                  formValues['mEnd'+tempform[u].id].value+"-"
                                          };
                                      }
                                  }else
                                    complexValues[tempform[u].id]=null;
                                  break;
                        }

                     }
                  }



                 complexValues["idRequest"]=idRequest;
                 return(complexValues);
                },
                getXmlKeyValueDocument: function(returnType, namespace){
                    var formKeyValue=new OpenLayers.Format.XMLKeyValue();
                    var values=this.getFormValues();
                    if(values){
                      var keyValueObj={
                        confValues: this.confValues,
                        formValues: values
                      };
                      return(formKeyValue.write(keyValueObj, {returnType: returnType, namespace: namespace}));  
                    }else
                      return(null);  
                    
                },
                comboFormOnladRenderdVector: null,
                renderdVectors: null,
                sendXmlKeyValueRequest: function(renderObjectId,timeout,loadingBarImg){
                   var timeoutRequest;
                   if(timeout)
                     timeoutRequest=timeout;
                   else
                     timeoutRequest=60;
                   var outputManager=this.outputManager;
                   var serviceRequest=this.getXmlKeyValueDocument("String");
                   var serviceResponse="";
                   var ajax = assignXMLHttpRequest(); 
                   var proxyResponseUrlTag="responseUrl";
                   var objElementOutput=document.getElementById(renderObjectId);
                   barProgress=Ext.Msg.progress("GisClient", 'Sending request', "Please Wait.." );
                   objElementOutput.innerHTML="<br><br><table width='100%'><tr><td align='center'><img src='"+loadingBarImg+"'></td></tr><tr><td align='center'>Please Wait...</td></tr></table>";
                   var onload=this.executeonLoadOperations;
                   var keyValueResponse= function(response){
                          barProgress=barProgress.updateProgress(0.7,  "Response Recived", "Request Sent" );
                          var outputStore;
                          objElementOutput.innerHTML="";
                          serviceResponse=response;
                          var startUrl=serviceResponse.indexOf("<"+proxyResponseUrlTag+">")+2+proxyResponseUrlTag.length;
                          var url=serviceResponse.substr(startUrl);
                          url=url.substr(0,url.indexOf("</"+proxyResponseUrlTag+">"));
                          switch(outputManager.container){
                              case "grid":
                                          outputStore=new Ext.data.Store({
                                                        nocache : true,
                                                        url: url,
                                                        reader : outputManager.readerTempalte,
                                                        remoteSort : false
                                                   
                                          });
                                          
                                          outputStore.load({
                                              callback: function(){
                                                  barProgress=barProgress.updateProgress(1,  "Processing...", "Response Recived" );
                                                  setTimeout('barProgress.hide()',800);
                                                  onload(outputPanel.store,outputManager);
                                              }
                                          });  
                                           
                                          var outputPanel = new Ext.grid.GridPanel({
                                                  store: outputStore,
                                                  colModel: outputManager.colMod,
                                                  autoHeight : true,
                                                  trackMouseOver:true,
                                                  sm: new Ext.grid.RowSelectionModel({selectRow:Ext.emptyFn}),
                                                  plugins: outputManager.plugins,
                                                  loadMask: true,
                                                  viewConfig: {
                                                            forceFit:true
                                                  },
                                      
                                                  split: true,
                                                  renderTo: renderObjectId
                                          });
                                          
                                          break;
                          }
                  };
                  var keyValueResponseTimeOut= function(){
                      Ext.Msg.alert('Error', 'Time OUT Xml Key Value Request');
                  };
                  var keyValueError= function(response){
                      if(response)
                         gisClientError="<br><br><p align='center'><textarea rows='"+screen.height/36+"' cols='"+ screen.width/18+"'>"+response+"</textarea></p>";
                      else
                         gisClientError="Not Details";
                     if(!document.getElementById('ErrorGisClient')){
                        var errorNode=document.createElement('div');
                        errorNode.setAttribute("id", "ErrorGisClient");
                        document.getElementsByTagName("body")[0].appendChild(errorNode);
                     }   
                      var windDetailsError="javascript:document.getElementById(\'ErrorGisClient\').innerHTML=gisClientError;new Ext.Window({"+
                            "title: 'Error Details',"+
                            "border: false,"+
                            "animCollapse : true,"+
                            "autoScroll : true,"+
                            "resizable : true,"+
                            "collapsible: true,"+
                            "maximizable: true,"+
                            "layout: 'fit',"+
                            "width: "+ screen.width/2+","+
			    "height: "+ screen.height/2+","+
                            "closeAction:'close',"+
                            "contentEl: 'ErrorGisClient'"+
                       "}).show();";
                      objElementOutput.innerHTML="<br><br><table width='100%'><tr><td align='center'><img src='style/img/error.png'></td></tr>"+
                                                 "<tr><td align='center'>Response ERROR</td></tr>"+
                                                 "<tr><td align='center'><a href=\""+windDetailsError+"\">Details</a></td></tr></table>";
                                            
                  }
                  barProgress=barProgress.updateProgress(0.2,  "Waiting Response", "Request Sent");
                  sendXmlHttpRequestTimeOut("POST", 
                                proxyRedirect, 
                                true, serviceRequest, timeoutRequest, keyValueResponse, keyValueResponseTimeOut, null, null, keyValueError);
                },
               
                executeonLoadOperations:function(store,outMan,layerName, style){
                
                    var i;
                    if(!this.renderdVectors)
                       this.renderdVectors=new Object();


                          for(var z=0; z<outMan.onLoadOperations.length; z++){
                             switch(outMan.onLoadOperations[z].type){
                                  case "render":
                                      if(outMan.onLoadOperations[z].vectorLayer){
                                          var mapObj=eval(outMan.onLoadOperations[z].mapObjcetName);
                                          mapObj.removeLayer(outMan.onLoadOperations[z].vectorLayer);
                                          outMan.onLoadOperations[z].vectorLayer=null;
                                      }

                                      for(i=0;i<store.getCount();i++){
                                 
                                        // this.comboFormOnladRenderdVector=outMan.onLoadOperations[z].actionOnLoad(store.getAt(i).data[outMan.onLoadOperations[z].attributeGeometry],'lat,lon',' ', store.getAt(i), layerName ,this.renderdVectors,this.comboFormOnladRenderdVector,style);
                                         outMan.onLoadOperations[z].actionOnLoad(store.getAt(i).data[outMan.onLoadOperations[z].attributeGeometry]);
                                      }

                                      break;
                             }
                          }
                }
                
              };
  return(_formObj_[_formObj_.length-1]);
}

function createExjFormByElement(title, formDataElement, numCols, localizationObj){

   var valuesControl=new Array(); 
   var groupFormElements;
  
    groupFormElements= new XmlElement(formDataElement).selectNodes("gis:group");
 
 
   var inputFormElements,optionInputElements,htmlContentElements;
   var fieldSets=new Array();
   var inputArray = new Array();
   var optionArray = new Array();
   var i,j,value="",label;
   for(var u=0; u<groupFormElements.length;u++){
      inputArray = new Array();
      
          inputFormElements= new XmlElement(groupFormElements[u]).selectNodes("gis:input");
      for(i=0; i<inputFormElements.length; i++){
          
         optionInputElements =new XmlElement(inputFormElements[i]).selectNodes("gis:option");
         for(j=0; j<optionInputElements.length;j++){
               value=optionInputElements[j].getAttribute("value");
               label=optionInputElements[j].firstChild.nodeValue;

               if(value==null)
                  optionArray[j]=[label, label];
               else
                  optionArray[j]=[value, label];       
         }
         
       var htmlValue=null;  
       htmlContentElements =new XmlElement(inputFormElements[i]).selectNodes("gis:htmlContent");
       if(htmlContentElements.length > 0){
          if(htmlContentElements[0].getAttribute("type") == 'HTML')
            htmlValue=new XMLSerializer().serializeToString(htmlContentElements[0]);
          else{
            htmlValue=new XMLSerializer().serializeToString(htmlContentElements[0]); 
            htmlValue=replaceAll(htmlValue,"&lt;","<");
            htmlValue=replaceAll(htmlValue,"&gt;",">");
            htmlValue=replaceAll(htmlValue,"&amp;","&");
          }
       }
        
       inputArray[i]={
                localization: localizationObj,
                        name: inputFormElements[i].getAttribute("name"),
                        type: inputFormElements[i].getAttribute("type"),
                          id: inputFormElements[i].getAttribute("id"),
                        size: inputFormElements[i].getAttribute("size"),
                        icon: inputFormElements[i].getAttribute("iconImage"),
                     colSpan: inputFormElements[i].getAttribute("colSpan"),
                        cols: inputFormElements[i].getAttribute("cols"),
                        rows: inputFormElements[i].getAttribute("rows"),
                       label: inputFormElements[i].getAttribute("label"),
                  labelStart: inputFormElements[i].getAttribute("labelStart"),
                    labelEnd: inputFormElements[i].getAttribute("labelEnd"),
                        grow: inputFormElements[i].getAttribute("grow"),
                  labelStyle: inputFormElements[i].getAttribute("labelStyle"),
                     aoiName: inputFormElements[i].getAttribute("aoiName"),
                    aoiColor: inputFormElements[i].getAttribute("aoiColor"),
                    aoiWidth: parseInt(inputFormElements[i].getAttribute("aoiWidth")),
              labelSeparator: inputFormElements[i].getAttribute("labelSeparator"),
                      hidden: inputFormElements[i].getAttribute("hidden"),
                    disabled: inputFormElements[i].getAttribute("disabled"),
               maxLengthText: inputFormElements[i].getAttribute("maxLengthText"),
               minLengthText: inputFormElements[i].getAttribute("minLengthText"),
                       vtype: inputFormElements[i].getAttribute("contentControl"),
                   vtypeText: inputFormElements[i].getAttribute("NotValidValueMessage"),
                 invalidText: inputFormElements[i].getAttribute("invalidText"),
                   blankText: inputFormElements[i].getAttribute("blankText"),
                  allowBlank: inputFormElements[i].getAttribute("optional"),
                      format: inputFormElements[i].getAttribute("format"),
                       value: inputFormElements[i].getAttribute("value"),
                  divContent: inputFormElements[i].getAttribute("divContent"),
                   /* minValue: inputFormElements[i].getAttribute("minValue"),
                    maxValue: inputFormElements[i].getAttribute("maxValue"),*/
                   htmlValue: htmlValue,
                      height: inputFormElements[i].getAttribute("height"),
                   labelList: inputFormElements[i].getAttribute("labelList"),
                  labelAlign: inputFormElements[i].getAttribute("labelAlign"),
                  bboxLabels: inputFormElements[i].getAttribute("bboxLabels"),
                   valueList: inputFormElements[i].getAttribute("valueList"),
                 valueCheked: inputFormElements[i].getAttribute("valueCheked"),
            decimalSeparator: inputFormElements[i].getAttribute("decimalSeparator"),
            decimalPrecision: inputFormElements[i].getAttribute("decimalPrecision"),
                   hideLabel: inputFormElements[i].getAttribute("hideLabel"),
                    onChange: inputFormElements[i].getAttribute("onChange"),
             onclickFunction: inputFormElements[i].getAttribute("onclick"),
           handlerParameters: inputFormElements[i].getAttribute("handlerParameters"),
             enableInputList: inputFormElements[i].getAttribute("enableInputList"),
   alternativeCheckInputList: inputFormElements[i].getAttribute("alternativeCheckInputList"),
      formObjectInstanceName: inputFormElements[i].getAttribute("formObjectInstanceName"),
                       store: inputFormElements[i].getAttribute("store"),
                      action: inputFormElements[i].getAttribute("action"),
                      target: inputFormElements[i].getAttribute("target"),
              storeAttribute: inputFormElements[i].getAttribute("storeAttribute"),
                 submitLabel: inputFormElements[i].getAttribute("submitLabel"),
                   storeData: eval(inputFormElements[i].getAttribute("storeData")),
                 storeFields: eval(inputFormElements[i].getAttribute("storeFields")),
                  secondsDiv: eval(inputFormElements[i].getAttribute("secondsDiv")),
                     seconds: eval(inputFormElements[i].getAttribute("seconds")),
                      syntax: inputFormElements[i].getAttribute("syntax"),
                     toolbar: inputFormElements[i].getAttribute("toolbar"),
                  fontFamily: inputFormElements[i].getAttribute("fontFamily"),
              charmapDefault: inputFormElements[i].getAttribute("charmapDefault"),
                     plugins: inputFormElements[i].getAttribute("plugins"),
        syntaxSelectionAllow: inputFormElements[i].getAttribute("syntaxSelectionAllow"),
                loadCallback: inputFormElements[i].getAttribute("loadCallback"),
                saveCallback: inputFormElements[i].getAttribute("saveCallback"),
                 isMultiFile: eval(inputFormElements[i].getAttribute("isMultiFile")),
                defaultFiles: inputFormElements[i].getAttribute("defaultFiles"),
                         map: inputFormElements[i].getAttribute("map")
                  };
                  
       valuesControl.push(inputArray[i]);            
      }
     
     fieldSets[u] = {name: groupFormElements[u].getAttribute("label"),
                      fields: inputArray,
                      ddGroup: groupFormElements[u].getAttribute("ddGroup"),
                      
                      defualt: eval(groupFormElements[u].getAttribute("defualt"))
                 }; 
                 
     inputArray = null;            
   }
   valuesControl.push({
                          name:"idRequest",
                          id:"idRequest",
                          type:"text",
                          value: ""
                      });
   var formFieldSet=generateFormFieldSet(title, fieldSets, numCols, localizationObj);
   return({
           formFieldSet: formFieldSet.form,
           fieldSetList: formFieldSet.fieldSetArray,
           valuesControl: valuesControl  
          }); 
}

function getOutputMangerByElement(outputInformationElement){
  var outputManager={
        container: "",
        onLoadOperations:null,
        readerTempalte: null,
        plugins: null,
        colMod: null
  };  
  var templateElement= new XmlElement(outputInformationElement).selectNodes("gis:template");
  var templateContainer=templateElement[0].getAttribute("container");
  var templateFormat=templateElement[0].getAttribute("format");
  var rootStore=templateElement[0].getAttribute("rootStore");
  var nameAttributes=templateElement[0].getAttribute("attributeNamesStore");
  var titleAttributes=templateElement[0].getAttribute("attributeTitlesStore");
  var splitlNameAttributes=nameAttributes.split(",");
  var splitlTitleAttributes=titleAttributes.split(",");
  var record= new Array();
  for(var i=0; i<splitlNameAttributes.length;i++){
      record.push({name : splitlTitleAttributes[i], mapping: splitlNameAttributes[i]});  
  }
  if(templateFormat == "json"){ 
     var readerOutput = new Ext.data.JsonReader({
                        root : rootStore
                        }, 
                        Ext.data.Record.create(record)); 
     outputManager.readerTempalte=readerOutput;                   
  }
  switch(templateContainer){
         case "grid":
                     outputManager.container="grid";
                     var gridAttrbutesNode= new XmlElement(templateElement[0]).selectNodes("gis:gridAttrbutes");
                     var gridAttrbutes=gridAttrbutesNode[0].getAttribute("value").split(",");
                     var widthCols=gridAttrbutesNode[0].getAttribute("widthCols");
                     var sortable=gridAttrbutesNode[0].getAttribute("sortable");
                     var tempalteHtmlElement=new XmlElement(templateElement[0]).selectNodes("gis:tempalteHtml");
                     var generalHtmlTemplate=tempalteHtmlElement[0].getAttribute("value");
                     var tempalteOperations= new XmlElement(templateElement[0]).selectNodes("gis:templateOperations/gis:templateOperation");
                     var onloadOperations= new XmlElement(templateElement[0]).selectNodes("gis:onloadOperations/gis:onloadOperation");
                     var onLoadOperationsObjects=new Array();
                     var columsGrid= new Array();
                     for(i=0; i<gridAttrbutes.length; i++){
                         columsGrid.push("{id:'"+ gridAttrbutes[i]+"', header: '"+
                                         gridAttrbutes[i]+
                                         "', width: "+widthCols+", dataIndex: '"+
                                         gridAttrbutes[i]+
                                         "', sortable: "+sortable+"}"); 
                     }  
                     var opertaionHtml="";
                     var temp;
                     for(i=0; i<onloadOperations.length; i++){
                         temp=createCodeOnLoadOperation(onloadOperations[i]);
                         onLoadOperationsObjects.push(temp);
                     } 
                     for(i=0; i<tempalteOperations.length; i++){
                         opertaionHtml+=createHtmlTemplateOperation(tempalteOperations[i]);
                     }    
                     var expander = 
                         new Ext.grid.RowExpander({
                            tpl : new Ext.Template(generalHtmlTemplate+opertaionHtml)
                     });
                     var temp="[expander,";
                                    for(i=0;i<columsGrid.length;i++)
                                        if(i== (columsGrid.length-1))
                                            temp+=columsGrid[i]+"]";  
                                        else    
                                            temp+=columsGrid[i]+",";
                     var colMod=new Ext.grid.ColumnModel(eval(temp));
                     outputManager.onLoadOperations=onLoadOperationsObjects;
                     outputManager.colMod=colMod;
                     outputManager.plugins=expander;
                     break;
  }   
  return(outputManager);
}

function createHtmlTemplateOperation(templateOperationElement){
  var labelButton,imageButton,imageDimMin,imageDimMax;
  var type=templateOperationElement.getAttribute("type");


  var style,mapObjcetName,layerFillOpacity,layerGraphicOpacity,geometry,attributeGeometry,formatPoint,pointSeparator,mapLayerName;
  var posList,posListDimension,layerTitle,urlAttribute;
  switch(type){
         case "details":
                     var tempString="";
                     var attributes=templateOperationElement.getAttribute("attributes").split(",");
                     var container=templateOperationElement.getAttribute("container");
                     var idAttribute=templateOperationElement.getAttribute("idAttribute");
                     var htmlDetailsLine=templateOperationElement.getAttribute("htmlDetailsLine");
                     var layoutStart=templateOperationElement.getAttribute("htmlLayoutStart");
                     var layoutEnd=templateOperationElement.getAttribute("htmlLayoutEnd");
                     var groups=new XmlElement(templateOperationElement).selectNodes("gis:group");
                     var tempHtml, tempHtmlLine, tempAttributes, z;
                     var groupsHtml="";
                       
                     if(groups.length>0){   
                        for(var k=0; k<groups.length;k++){
                            tempAttributes=null; 
                            tempAttributes=groups[k].getAttribute("attributes").split(",");
                            if(tempAttributes.length ==0)
                               tempAttributes[0]=groups[k].getAttribute("attributes");  
                            tempHtmlLine=groups[k].getAttribute("htmlLine");
                            tempHtml=groups[k].getAttribute("htmlStart");
                            for(z=0;z<tempAttributes.length;z++){
                                tempString=tempHtmlLine.replace("$attributeValue",tempAttributes[z]); 
                                tempHtml+=tempString.replace("{$attributeName}", tempAttributes[z]);
                            }
                            tempHtml+=groups[k].getAttribute("htmlEnd");
                            groupsHtml+=tempHtml;  
                        }
                        
                     }
                     var htmlDetails="";
                     var htmlOperation="";

                     htmlDetails+=layoutStart;  
                     
                     for(var i=0; i<attributes.length; i++){
                      tempString=htmlDetailsLine.replace("$attributeValue",attributes[i]); 
                      htmlDetails+=tempString.replace("{$attributeName}", attributes[i]);
                     } 
                     htmlDetails+=groupsHtml+layoutEnd;
                     if(container == "window"){
                        var winWidth=eval(templateOperationElement.getAttribute("winWidth"));
                        var winHeight=eval(templateOperationElement.getAttribute("winHeight"));
                        labelButton=templateOperationElement.getAttribute("labelButton");
                        imageButton=templateOperationElement.getAttribute("imageButton");
                        imageDimMin=templateOperationElement.getAttribute("imageDimMin");
                        imageDimMax=templateOperationElement.getAttribute("imageDimMax");
                        var renderIteratorsFunction="";
                        var showdetailsWindow=/*/"function Details_"+idAttribute+"(){ "+*/
                                  "var htmlDetails_"+idAttribute+"='"+htmlDetails+"';"+
                                  "var win = new Ext.Window({ "+
                                            "title: '({"+idAttribute +"}) Result Details', "+
                                            "border: false, "+
                                            "animCollapse : true, "+
                                            "autoScroll : true, "+
                                            "maximizable: true, "+
                                            "resizable : true, "+
                                            "collapsible: true, "+
                                            "layout: 'fit', "+
                                            "width: "+winWidth+", "+
                                            "height: "+winHeight+", "+
                                            "closeAction:'close', "+
                                            "html: htmlDetails_"+idAttribute+
                                  "}); "+
                                  renderIteratorsFunction+
                                  "win.show();";
                       htmlOperation="<img  title='"+labelButton+"' src='"+imageButton+"' onmouseout=\"javascript:this.src='"+imageButton+"';this.width='"+imageDimMin+"';this.height='"+imageDimMin+"';\""+ 
                       " onmouseover=\"javascript:this.src='"+imageButton+"';this.width='"+imageDimMax+"';this.height='"+imageDimMax+"';\" width='"+imageDimMin+"'  height='"+imageDimMin+"'"+
                       " onclick=\"javascript:"+showdetailsWindow+"\"/>"+
                       "<img src='styles/img/empty.png' width='1'  height='"+imageDimMax+"'/>";
                       
                    }
                    else{
                       if(container == "template"){
                           
                       }  
                     }
                     break;
         case "renderAndZoom":
                      style=templateOperationElement.getAttribute("style");
                      mapObjcetName= templateOperationElement.getAttribute("mapObjcetName");
                      layerFillOpacity= templateOperationElement.getAttribute("layerOpacity");
                      layerGraphicOpacity= templateOperationElement.getAttribute("layerGraphicOpacity");
                      geometry= templateOperationElement.getAttribute("geometry");
                      attributeGeometry= templateOperationElement.getAttribute("attributeGeometry");
                      formatPoint= templateOperationElement.getAttribute("formatPoint");
                      pointSeparator= templateOperationElement.getAttribute("pointSeparator");
                      mapLayerName= templateOperationElement.getAttribute("mapLayerName");
                      posList= templateOperationElement.getAttribute("posList"),
                      posListDimension=templateOperationElement.getAttribute("posListDimension"),

                      labelButton=templateOperationElement.getAttribute("labelButton");
                      imageButton=templateOperationElement.getAttribute("imageButton");
                      imageDimMin=templateOperationElement.getAttribute("imageDimMin");
                      imageDimMax=templateOperationElement.getAttribute("imageDimMax");
                     
                      var pointZoom=templateOperationElement.getAttribute("zoomPoint");
                      if(!(pointZoom || pointZoom!=''))
                        pointZoom=attributeGeometry;
                    
                     var zoomFactor=templateOperationElement.getAttribute("zoomFactor");
                     var renderAndZoomFunction=""+ 
                               "geometryrendering ('{"+attributeGeometry+"}', '"+formatPoint+"', '"+pointSeparator+"', '"+geometry+"', '"+mapLayerName+"', eval("+style+"), '"+mapObjcetName+"', "+
                              "{layerFillOpacity: "+layerFillOpacity+","+
                               "layerGraphicOpacity: "+layerGraphicOpacity+" " + 
                              "},true);"+
                              "zoomTo('{"+pointZoom+"}', '"+formatPoint+"', '"+mapObjcetName+"', '"+zoomFactor+"');";
           
                       htmlOperation="<img  title='"+labelButton+"' src='"+imageButton+"' onmouseout=\"javascript:this.src='"+imageButton+"';this.width='"+imageDimMin+"';this.height='"+imageDimMin+"';\""+ 
                       " onmouseover=\"javascript:this.src='"+imageButton+"';this.width='"+imageDimMax+"';this.height='"+imageDimMax+"';\" width='"+imageDimMin+"'  height='"+imageDimMin+"'"+
                       " onclick=\"javascript:"+renderAndZoomFunction+"\"/>"+
                       "<img src='styles/img/empty.png' width='1'  height='"+imageDimMax+"'/>";
             
                    break;
         case "select":
                      style=templateOperationElement.getAttribute("style");
                      mapObjcetName= templateOperationElement.getAttribute("mapObjcetName");
                      layerFillOpacity= templateOperationElement.getAttribute("layerOpacity");
                      layerGraphicOpacity= templateOperationElement.getAttribute("layerGraphicOpacity");
                      geometry= templateOperationElement.getAttribute("geometry");
                      attributeGeometry= templateOperationElement.getAttribute("attributeGeometry");
                      formatPoint= templateOperationElement.getAttribute("formatPoint");
                      pointSeparator= templateOperationElement.getAttribute("pointSeparator");
                      posList= templateOperationElement.getAttribute("posList"),
                      posListDimension=templateOperationElement.getAttribute("posListDimension"),
                      mapLayerName= templateOperationElement.getAttribute("mapLayerName");
                      layerTitle= templateOperationElement.getAttribute("layerTitle"),

                     labelButton=templateOperationElement.getAttribute("labelButton");
                     imageButton=templateOperationElement.getAttribute("imageButton");
                     imageDimMin=templateOperationElement.getAttribute("imageDimMin");
                     imageDimMax=templateOperationElement.getAttribute("imageDimMax");

                     /*var pointZoom=templateOperationElement.getAttribute("zoomPoint");
                     if(!(pointZoom || pointZoom!=''))
                        pointZoom=attributeGeometry;

                     var zoomFactor=templateOperationElement.getAttribute("zoomFactor");*/
                     var renderSelectFunction=""+
                               "geometryrendering ('{"+attributeGeometry+"}', '"+formatPoint+"', '"+pointSeparator+"', '"+geometry+"', '"+mapLayerName+"', eval("+style+"), '"+mapObjcetName+"', "+
                              "{layerFillOpacity: "+layerFillOpacity+","+
                               "layerGraphicOpacity: "+layerGraphicOpacity+"," +
                               "layerTitle: '"+layerTitle+"' " +
                              "},true,'"+posList+"','"+posListDimension+"');";/*+
                              "zoomTo('{"+pointZoom+"}', '"+formatPoint+"', '"+mapObjcetName+"', '"+zoomFactor+"');";*/

                       htmlOperation="<img  title='"+labelButton+"' src='"+imageButton+"' onmouseout=\"javascript:this.src='"+imageButton+"';this.width='"+imageDimMin+"';this.height='"+imageDimMin+"';\""+
                       " onmouseover=\"javascript:this.src='"+imageButton+"';this.width='"+imageDimMax+"';this.height='"+imageDimMax+"';\" width='"+imageDimMin+"'  height='"+imageDimMin+"'"+
                       " onclick=\"javascript:"+renderSelectFunction+"\"/>"+
                       "<img src='styles/img/empty.png' width='1'  height='"+imageDimMax+"'/>";
                    break;
         case "viewImage":
                      var labelImage=templateOperationElement.getAttribute("labelImage");
                      var attribute=templateOperationElement.getAttribute("attribute");
                      var position=templateOperationElement.getAttribute("position");
                      var bgColor=templateOperationElement.getAttribute("bgColor");
                      imageDimMax=templateOperationElement.getAttribute("maxheight");
                      htmlOperation="<table align='"+position+"'><tr BGCOLOR='"+bgColor+"'><td valign='center'><b>"+labelImage+":</b></td><td><img  height='"+imageDimMax+"'align='"+position+"' title='"+labelImage+"' src='{"+attribute+"}' onclick=\"javascript:"+""+"\"/></p></td></tr></table>";
                    break;
         case "zoomAt":
             
                    break;
         case "getRequestPopup":
                     labelButton=templateOperationElement.getAttribute("labelButton");
                     imageButton=templateOperationElement.getAttribute("imageButton");
                     imageDimMin=templateOperationElement.getAttribute("imageDimMin");
                     imageDimMax=templateOperationElement.getAttribute("imageDimMax");
                     idAttribute=templateOperationElement.getAttribute("idAttribute");
                     urlAttribute=templateOperationElement.getAttribute("urlAttribute");
                     winWidth=eval(templateOperationElement.getAttribute("winWidth"));
                     var xslResponse=templateOperationElement.getAttribute("xslResponse");
                     winHeight=eval(templateOperationElement.getAttribute("winHeight"));
                     var serviceURL=templateOperationElement.getAttribute("serviceURL");
                     var serviceURLVariable=templateOperationElement.getAttribute("serviceURLVariable");


                     if(serviceURLVariable)
                       serviceURL=serviceURLVariable;
                     var getRequest;
                     if(urlAttribute){
                        getRequest="{"+urlAttribute+"}";
                        serviceURL="'ProxyRedirect?url='";
                     }
                     else
                      getRequest="httpservice?request=GetRepositoryItem&service=CSW-ebRIM&version=2.0.2&id={"+idAttribute +"}";


                     var showpopupWindow="var targetURL="+serviceURL+"+'"+getRequest+"&XSLResponse="+xslResponse+"&outFormat=text/html'; "+
                                  "\n var win = new Ext.Window({ "+
                                            "title: '({"+idAttribute +"}) Result Details', "+
                                            "border: false, "+
                                            //"id:'requestPopUp',"+
                                            "animCollapse : true, "+
                                            "autoScroll : true, "+
                                            "maximizable: true, "+
                                            "resizable : true, "+
                                            "collapsible: true, "+
                                            "bodyStyle : {background: '#ffffff'}, "+
                                            "layout: 'fit', "+
                                            "width: "+winWidth+", "+
                                            "height: "+winHeight+", "+
                                            "closeAction:'close', "+
                                       //     "html: response,"+
                                            "autoLoad: {url: targetURL , scripts: true}"+
                                  "}).show(); ";
                         
                              
                        htmlOperation="<img  title='"+labelButton+"' src='"+imageButton+"' onmouseout=\"javascript:this.src='"+imageButton+"';this.width='"+imageDimMin+"';this.height='"+imageDimMin+"';\""+
                       " onmouseover=\"javascript:this.src='"+imageButton+"';this.width='"+imageDimMax+"';this.height='"+imageDimMax+"';\" width='"+imageDimMin+"'  height='"+imageDimMin+"'"+
                       " onclick=\"javascript:"+showpopupWindow+"\"/>"+
                       "<img src='styles/img/empty.png' width='1'  height='"+imageDimMax+"'/>";

                    break;
  }       
   
    return(htmlOperation);              
    
}

function createCodeOnLoadOperation(onLoadOperationElement){
    var onLoadOperation=null;
    var type=onLoadOperationElement.getAttribute("type");
  switch(type){
         case "render":
                       onLoadOperation={
                         type: type,
                         vectorLayer: null,
                         style: onLoadOperationElement.getAttribute("style"),
                         mapObjcetName: onLoadOperationElement.getAttribute("mapObjcetName"),
                         layerFillOpacity: onLoadOperationElement.getAttribute("layerOpacity"),
                         layerGraphicOpacity: onLoadOperationElement.getAttribute("layerGraphicOpacity"),
                         geometry: onLoadOperationElement.getAttribute("geometry"),
                         posList: onLoadOperationElement.getAttribute("posList"),
                         posListDimension: onLoadOperationElement.getAttribute("posListDimension"),
                         attributeGeometry: onLoadOperationElement.getAttribute("attributeGeometry"),
                         pointSeparator: onLoadOperationElement.getAttribute("pointSeparator"),
                         formatPoint: onLoadOperationElement.getAttribute("formatPoint"),
                         layerName: onLoadOperationElement.getAttribute("layerName"),
                         //layerName:onLoadOperationElement.getAttribute("layerName"),
                         actionOnLoad: function(pointsString/*, format, separator*/){
                           if(pointsString!=""){
                             var pointsArray;
                             var olPointsArray=new Array();
                             
                              if(this.posList && this.posList!=""){
                                
                                 pointsArray=pointsString.split(" ");
                                 if(this.posListDimension == "2"){
                                   var tempLat,tempLong;
                                   for(i=0; i<pointsArray.length;i=i+2){
                                       tempLat=pointsArray[i];
                                       if(pointsArray[i+1])
                                         tempLong=pointsArray[i+1];
                                       else
                                         tempLong=pointsArray[0];
                                
                                       olPointsArray.push(new OpenLayers.Geometry.Point(tempLong,tempLat));
                                   }
                                 }
                              }else{
                                 pointsArray=pointsString.split(this.pointSeparator);
                                 if(pointsArray.lenght==0)
                                    pointsArray[0]=pointsString;
                                 var i,latIndex,lonIndex,formatSeparator,tempPointSplit;
                                 var latFormatPosition=this.formatPoint.indexOf('lat');
                                 formatSeparator=this.formatPoint[3];
                                 if(latFormatPosition == 0){
                                    latIndex=0;lonIndex=1;
                                 }else{
                                    latIndex=1;lonIndex=0;
                                 }
                                 for(i=0; i<pointsArray.length;i++){
                                        tempPointSplit=pointsArray[i].split(formatSeparator);
                                        olPointsArray.push(new OpenLayers.Geometry.Point(tempPointSplit[lonIndex], tempPointSplit[latIndex]));
                                 }
                              }

                              var olStyle;
                              if (this.style && this.style!="")
                                  olStyle=this.style;
                              else
                                  olStyle = {
                                    fillColor: "#ee9900",
                                    fillOpacity: 0.4, 
                                    hoverFillColor: "white",
                                    hoverFillOpacity: 0.8,
                                    strokeColor: "#000000",
                                    strokeOpacity: 1,
                                    strokeWidth: 0.8,
                                    strokeLinecap: "round",
                                    hoverStrokeColor: "red",
                                    hoverStrokeOpacity: 1,
                                    hoverStrokeWidth: 0.2,
                                    pointRadius: 6,
                                    hoverPointRadius: 1,
                                    hoverPointUnit: "%",
                                    pointerEvents: "visiblePainted",
                                    cursor: ""
                              }
                              
                              var mapObject=eval(this.mapObjcetName);
                              var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                              if(this.layerFillOpacity)
                                 layer_style.fillOpacity = this.layerFillOpacity;
                              if(this.layerGraphicOpacity)
                                 layer_style.graphicOpacity = this.layerGraphicOpacity;
                              var feature;
                              switch(this.geometry){
                                    case "polygon":
                                            var linearRing = new OpenLayers.Geometry.LinearRing(olPointsArray);
                                            feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([linearRing]),null,olStyle);
                                            break;
                                    case   "point":
                                            feature = new OpenLayers.Feature.Vector(olPointsArray[0],null,olStyle);
                                            break; 
                                    case    "line":
                                            feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(olPointsArray),null,olStyle);
                                            break;          
                              }
                             if(!this.vectorLayer){ 
                                this.vectorLayer=new OpenLayers.Layer.Vector(this.layerName, {style: layer_style});
                                mapObject.addLayer(this.vectorLayer);
                                this.vectorLayer.addFeatures([feature]);
                                
                             }else{
                               this.vectorLayer.addFeatures([feature]);  
                             }
                     
                         }
                       }  
                     }; 
                    
                     
          break;
  }         
  
 return(onLoadOperation);
}


function zoomTo (pointString, formatPoint, mapObjcetName, zoomfactor){
   var mapObj=eval(mapObjcetName);   
   var latFormatPosition=formatPoint.indexOf('lat');
   var latIndex,lonIndex;
   if(latFormatPosition == 0){
          latIndex=0;lonIndex=1; 
       }else{
          latIndex=1;lonIndex=0; 
       }
   var pointSeparator=formatPoint[3];
   var tempPointSplit=pointString.split(pointSeparator);
   var lonLat = new OpenLayers.LonLat(tempPointSplit[lonIndex], tempPointSplit[latIndex]);
   mapObj.setCenter (lonLat, zoomfactor);
}


/*this.style --> style     mapObjcetName--> this.mapObjcetName     this.layerFillOpacity --> layerOptions  this.layerGraphicOpacity-->layerOptions
 *this.geometry --> geometry      this.vectorLayer --> vectorLayer   */
function geometryrendering (pointsString, format, separator, geometry, vectorLayer, style, mapObjcetName, layerOptions, replace, posList, posListDimension){
 
      
       var i,pointsArray;
       var olPointsArray=new Array();
   
       if(separator== 'null'){
          pointsArray=pointsString.split(" ");
          if(posListDimension == "2"){
             var tempLat,tempLong;
             for(i=0; i<pointsArray.length;i=i+2){
                 tempLat=pointsArray[i];
                 if(pointsArray[i+1])
                    tempLong=pointsArray[i+1];
                 else
                    tempLong=pointsArray[0];
                 olPointsArray.push(new OpenLayers.Geometry.Point(tempLong,tempLat));
             }
          }
       }else{

        pointsArray=pointsString.split(separator);
        if(pointsArray.lenght==0)
          pointsArray[0]=pointsString; 
        var latIndex,lonIndex,formatSeparator,tempPointSplit;
        var latFormatPosition=format.indexOf('lat');
        formatSeparator=format[3];
        if(latFormatPosition == 0){
            latIndex=0;lonIndex=1;
        }else{
            latIndex=1;lonIndex=0;
        }
        for(i=0; i<pointsArray.length;i++){
            tempPointSplit=pointsArray[i].split(formatSeparator);
            olPointsArray.push(new OpenLayers.Geometry.Point(tempPointSplit[lonIndex], tempPointSplit[latIndex]));
         }
       }

        var olStyle;
        if (style && style!="")
           olStyle=style;
        else
           olStyle = {
                      fillColor: "#ee9900",
                      fillOpacity: 0.4, 
                      hoverFillColor: "white",
                      hoverFillOpacity: 0.8,
                      strokeColor: "#000000",
                      strokeOpacity: 1,
                      strokeWidth: 0.8,
                      strokeLinecap: "round",
                      hoverStrokeColor: "red",
                      hoverStrokeOpacity: 1,
                      hoverStrokeWidth: 0.2,
                      pointRadius: 6,
                      hoverPointRadius: 1,
                      hoverPointUnit: "%",
                      pointerEvents: "visiblePainted",
                      cursor: ""
                     }
         
         var mapObject=eval(mapObjcetName);
         var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
         if(layerOptions.layerFillOpacity)
            layer_style.fillOpacity = layerOptions.layerFillOpacity;
         if(layerOptions.layerGraphicOpacity)
            layer_style.graphicOpacity = layerOptions.layerGraphicOpacity;
         var feature;
         switch(geometry){
                case "polygon":
                      var linearRing = new OpenLayers.Geometry.LinearRing(olPointsArray);
                      feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([linearRing]),null,olStyle);
                      break;
                case  "point":
                      feature = new OpenLayers.Feature.Vector(olPointsArray[0],null,olStyle);
                      break; 
                case    "line":
                     
                      feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(olPointsArray),null,olStyle);
                      break;          
               }
             
      var vectorLayerObj=eval(vectorLayer);
       var setLayerFunction="set_"+vectorLayer+"(new OpenLayers.Layer.Vector('"+layerOptions.layerTitle+"', {style: layer_style}));";
       if(!vectorLayerObj){ 
          eval(setLayerFunction);
          vectorLayerObj=eval(vectorLayer);
          mapObject.addLayer(vectorLayerObj);
          vectorLayerObj.addFeatures([feature]);
       }else{
           if(replace){ 
             mapObject.removeLayer(vectorLayerObj);  
             eval(setLayerFunction);
             vectorLayerObj=eval(vectorLayer);
             mapObject.addLayer(vectorLayerObj);
             vectorLayerObj.addFeatures([feature]);
           }    
           else    
            vectorLayerObj.addFeatures([feature]);  
       }         
    /* var layerName=vectorLayer;

       var vectorLayerObj=mapObject.getLayersByName(layerName)[0];

       if(!vectorLayerObj){
          vectorLayerObj=new OpenLayers.Layer.Vector(layerName, {style: layer_style, displayInLayerSwitcher: layerOptions.displayInLayerSwitcher});
          mapObject.addLayer(vectorLayerObj);
          vectorLayerObj.addFeatures([feature]);
       }else{
           if(replace){
             mapObject.removeLayer(vectorLayerObj);
             vectorLayerObj=new OpenLayers.Layer.Vector(layerName, {style: layer_style, displayInLayerSwitcher: layerOptions.displayInLayerSwitcher});
             mapObject.addLayer(vectorLayerObj);
             vectorLayerObj.addFeatures([feature]);
           }
           else
            vectorLayerObj.addFeatures([feature]);
       }       */    

}

function generateListOfFieldSet(fieldSets, numberColums, localizationObj){ 
  var fieldSetArray= new Array();
  var listField;
  var groupName;


  for(var i=0;i<fieldSets.length;i++){
     listField=generateListOfField(fieldSets[i].fields); 
     if(localizationObj && fieldSets[i].name && fieldSets[i].name!="")
        groupName=localizationObj.getLocalMessage(fieldSets[i].name);
     else
        groupName=fieldSets[i].name;
   

     fieldSetArray[i]= new Ext.form.FieldSet({
                  title: groupName,
                  layout: 'table',
                  draggable: fieldSets[i].draggable,
                  ddGroup: fieldSets[i].ddGroup,
                  layoutConfig: {
                      columns: numberColums
                  },
                  autoHeight: true,
               
                  items: listField
                
            });
  }
  
  return(fieldSetArray);  
    
}

function generateListOfField(Fields){
  var fieldsArray= new Array();
  var j=0;
  var k,temp;
  for(var i=0;i<Fields.length;i++){
      switch(Fields[i].type) {
          case "text":temp= new Array();
                  temp=generateTextField(Fields[i]);
                  for(k=0; k<temp.length; k++){
                      fieldsArray[j]=temp[k]; 
                      j++;
                  }   
                  break;
          case "password":temp= new Array();
                  temp=generatePasswordField(Fields[i]);
                  for(k=0; k<temp.length; k++){
                      fieldsArray[j]=temp[k]; 
                      j++;
                  }   
                  break;        
          case "numeric":temp= new Array();
                  temp=generateNumericField(Fields[i]);
                  for(k=0; k<temp.length; k++){
                      fieldsArray[j]=temp[k]; 
                      j++;
                  }   
                  break;
          case "numericRange":temp= new Array();
                  temp=generateNumericRangeField(Fields[i]);
                  for(k=0; k<temp.length; k++){
                      fieldsArray[j]=temp[k];
                      j++;
                  }
                  break;
          case "combo":temp= new Array();
                  temp=generateComboField(Fields[i]);
                  for(k=0; k<temp.length; k++){
                      fieldsArray[j]=temp[k]; 
                      j++;
                  }   
                  break;
          case "checkbox":temp= new Array();
                  temp=generateCheckBoxField(Fields[i]);  
                  for(k=0; k<temp.length; k++){
                      fieldsArray[j]=temp[k]; 
                      j++;
                  }   
                  break;
          case "checkboxgroup":temp= new Array();
                  temp=generateCheckBoxGroupField(Fields[i]);
                  for(k=0; k<temp.length; k++){
                      fieldsArray[j]=temp[k];
                      j++;
                  }
                  break;
          case "radiogroup":temp= new Array();
                  temp=generateRadioGroupField(Fields[i]);  
                  for(k=0; k<temp.length; k++){
                      fieldsArray[j]=temp[k]; 
                      j++;
                  }   
                  break;        
          case "date":temp= new Array();
                  temp=generateDateField(Fields[i]); 
                  for(k=0; k<temp.length; k++){
                      fieldsArray[j]=temp[k]; 
                      j++;
                  }   
                  break;
          case "rangedate":temp= new Array();
                  temp=generateRangeDateField(Fields[i]); 
                  for(k=0; k<temp.length; k++){
                      fieldsArray[j]=temp[k]; 
                      j++;
                  }   
                  break;
          case "label":temp= new Array();
                  temp=generateLabelField(Fields[i]);
                  for(k=0; k<temp.length; k++){
                      fieldsArray[j]=temp[k]; 
                      j++;
                  }   
                  break;
          case "file":temp= new Array();
                  temp=generateFileField(Fields[i]);
                  for(k=0; k<temp.length; k++){
                      fieldsArray[j]=temp[k]; 
                      j++;
                  }   
                  break;        
          case "bbox":temp= new Array();
                  temp=generateBBOXField(Fields[i]);
                  for(k=0; k<temp.length; k++){
                      fieldsArray[j]=temp[k]; 
                      j++;
                  }   
                  break;
          case "button":temp= new Array();
                  temp=generateButtonField(Fields[i]);
                  for(k=0; k<temp.length; k++){
                      fieldsArray[j]=temp[k]; 
                      j++;
                  }   
                  break;
          case "timeStep":temp= new Array();
                  temp=generateTimeStepField(Fields[i]);
                  for(k=0; k<temp.length; k++){
                      fieldsArray[j]=temp[k]; 
                      j++;
                  }   
                  break;
          case "time":temp= new Array();
                  temp=generateTimeField(Fields[i]);
                  for(k=0; k<temp.length; k++){
                      fieldsArray[j]=temp[k]; 
                      j++;
                  }   
                  break;
          case "rangetime":temp= new Array();
                  temp=generateRangeTimeField(Fields[i]);
                  for(k=0; k<temp.length; k++){
                      fieldsArray[j]=temp[k]; 
                      j++;
                    }  
                  break;   
          case "percentage":temp= new Array();
                  temp=generatePercentageField(Fields[i]);
                  for(k=0; k<temp.length; k++){
                      fieldsArray[j]=temp[k]; 
                      j++;
                    }  
                  break;   
          case "textarea":temp= new Array();
                  temp=generateTextAreaField(Fields[i]);
                  for(k=0; k<temp.length; k++){
                      fieldsArray[j]=temp[k]; 
                      j++;
                    }  
                  break;
          case "editarea":temp= new Array();
                  temp=generateEditAreaField(Fields[i]);
                  for(k=0; k<temp.length; k++){
                      fieldsArray[j]=temp[k];
                      j++;
                    }
                  break;
        }
   }

  return(fieldsArray);    
}

function generateTextField(field){ 
  var formField=new Array(), size="20";
  var colSpan=0;
  if (field.colSpan)
      colSpan=(parseFloat(field.colSpan)-1)*numberColsField;
  if (field.size)
      size=field.size;
  
  var u=0;

 if(colSpan>0){
    formField[0]={
        colspan: colSpan,
        html: "&nbsp;"
    };
    u++;
  }  
  var allowBlank=true;
  if(field.allowBlank == "false")
     allowBlank=false; 
 
  var onchange="";
  if(!allowBlank)
     onchange+="_formObj_[_formObj_.length-1].onChangeFieldControlMandatory();"; 
  if(field.onChange)
    onchange+=field.onChange;

  var label;
  if(field.localization && field.label!="" && field.label){
    label=field.localization.getLocalMessage(field.label);
  }else
   label=field.label;   
    

  formField[u]={
             colspan: numberColsField,
             layout: "form",
             labelAlign: field.labelAlign,
             items: [new Ext.form.TextField({
				name: field.name,
                                autoCreate : {
                                    tag: "input", 
                                    id: field.id,
                                    type: "text", 
                                    onchange: onchange,
                                    size: size, 
                                    autocomplete: "off"
                                },
                                value: field.value,
                                hideLabel: field.hideLabel,
                                disabled: field.disabled,
                                hidden: field.hidden,
                                id: field.id,
                                //change: eval(field.onChange), 
                                labelStyle: field.labelStyle,
                                labelSeparetor: field.labelSeparetor,
				fieldLabel: label,
                                storeAttribute: field.storeAttribute,
                                grow: field.grow,
                                msgTarget : 'qtip',
                                vtype: field.vtype,
                                vtypeText: field.vtypeText,
                                allowBlank:allowBlank
			})]
  };                  

  return(formField);  
}

function generatePasswordField(field){ 
  var formField=new Array(), size="20";
  var colSpan=0;
  if (field.colSpan)
      colSpan=(parseFloat(field.colSpan)-1)*numberColsField;
  if (field.size)
      size=field.size;
  
  var u=0;
  if(colSpan>0){
    formField[0]={
        colspan: colSpan,
        html: "&nbsp;"
    };
    u++;
  }   
  var allowBlank=true;
  if(field.allowBlank == "false")
     allowBlank=false; 
 
  var onchange="";
  if(!allowBlank)
     onchange+="_formObj_[_formObj_.length-1].onChangeFieldControlMandatory();"; 
  if(field.onChange)
    onchange+=field.onChange;
  
  var label;
  if(field.localization && field.label!="" && field.label){
    label=field.localization.getLocalMessage(field.label);
  }else
   label=field.label;
 
  formField[u]={
             colspan: numberColsField,
             layout: "form",
             items: [new Ext.form.TextField({
				name: field.name,
                                autoCreate : {
                                    tag: "input", 
                                    id: field.id,
                                    type: "text", 
                                    onchange: onchange,
                                    size: size, 
                                    autocomplete: "off"
                                },
                                value: field.value,
                                hideLabel: field.hideLabel,
                                disabled: field.disabled,
                                hidden: field.hidden,
                                id: field.id,
                                //change: eval(field.onChange), 
                                labelStyle: field.labelStyle,
                                labelSeparetor: field.labelSeparetor,
				fieldLabel: label,
                                grow: field.grow,
                                msgTarget : 'qtip',
                                vtype: field.vtype,
                                vtypeText: field.vtypeText,
                                inputType: 'password',
                                allowBlank:allowBlank
			})]
  };                  

  return(formField);  
}

function generateCheckBoxField(field){
  var formField=new Array();
  var colSpan=0;
  if (field.colSpan)
      colSpan=(parseFloat(field.colSpan)-1)*numberColsField;
  else
      colSpan=1;
  var u=0;

  /*if(colSpan>0){
    formField[0]={
        colspan: colSpan,
        html: "&nbsp;"
    };
    u++;
  }*/
  var enableInputFunction,alternativeCheckFunction,checkEvent="";

  var label;
  if(field.localization && field.label!="" && field.label){
    label=field.localization.getLocalMessage(field.label);
  }else
   label=field.label;

  var checkboxField=new Ext.form.Checkbox({
				name: field.name,
                                autoCreate : {
                                    tag: "input",
                                    id: field.id,
                                    type: "checkbox",
                                    autocomplete: "off"
                                },
                                boxLabel: label,
                                label: field.label,
                                checked: field.value,
                                hideLabel: true,
                                disabled: field.disabled,
                                hidden: field.hidden,
                                id: field.id,
                                labelStyle: field.labelStyle,
                                labelSeparetor: field.labelSeparetor,
                                msgTarget : 'qtip',
                                allowBlank:field.allowBlank
			});

  formField[u]={
             colspan: /*numberColsField*/colSpan*numberColsField,
             layout: "form",
             items: [checkboxField]
  };
   if(field.enableInputList){
       enableInputFunction=new Function(/*"function(){"+*/
              "var enableInputList=\""+field.enableInputList+"\";"+
              "var arrayInput=enableInputList.split(',');"+
              "var tmp;"+
              "var indexForm;"+
          
              "for(var i=0; i<arrayInput.length;i++){"+
                  "tmp=arrayInput[i].split('-');"+
                  "indexForm=parseInt(tmp[0]);"+
                  "if(this.getValue())"+
                    field.formObjectInstanceName+".formsArray[indexForm].getForm().findField(tmp[1]).enable();"+
                  "else {"+
                    field.formObjectInstanceName+".formsArray[indexForm].getForm().findField(tmp[1]).disable();"+
                    field.formObjectInstanceName+".formsArray[indexForm].getForm().findField(tmp[1]).setValue('');"+
                  " }"+
              "}");
       checkboxField.addListener('check', eval(enableInputFunction));
       //checkEvent+="eval(enableInputFunction);";
       //checkboxField.on('check', eval(enableInputFunction));
   }
   if(field.alternativeCheckInputList){
       alternativeCheckFunction=new Function(/*"function(){"+*/
              "var alternativeCheckInputList=\""+field.alternativeCheckInputList+"\";"+
              "var arrayInput=alternativeCheckInputList.split(',');"+
              "var tmp;"+
              "var indexForm;"+
           
              "for(var i=0; i<arrayInput.length;i++){"+
                  "tmp=arrayInput[i].split('-');"+
                  "indexForm=parseInt(tmp[0]);"+
                  "if(this.getValue() && Boolean("+field.formObjectInstanceName+".formsArray[indexForm].getForm().findField(tmp[1]).getValue())){ "+
                    field.formObjectInstanceName+".formsArray[indexForm].getForm().findField(tmp[1]).setValue(false);"+
                  " }"+
              "}");
     //checkEvent+="+alternativeCheckFunction);";
     checkboxField.addListener('check', eval(alternativeCheckFunction));
       //checkboxField.on('check', eval(alternativeCheckFunction));
   }
   if(field.onChange)
     //checkEvent+="eval(field.onChange); ";
     //checkboxField.on('check', eval(field.onChange));
     checkboxField.addListener('check', eval(field.onChange));
 
   //checkboxField.on('check', eval(checkEvent));
  return(formField);
}

function generateCheckBoxGroupField(field){
  var formField=new Array();
  var colSpan=0;
  if (field.colSpan)
    colSpan=(parseFloat(field.colSpan)-1)*numberColsField;
  else
    colSpan=1;
  var u=0;
  //var enableInputFunction,alternativeCheckFunction,checkEvent="";

  var label;
  if(field.localization && field.label!="" && field.label){
    label=field.localization.getLocalMessage(field.label);
  }else
   label=field.label;

  var valuesArray=field.valueList.split(",");
  var itemsArray=new Array();
  var checkInfo;
  for(var ii=0; ii<valuesArray.length; ii++){
      checkInfo=valuesArray[ii].split(":");
      if(checkInfo.length == 2)
         itemsArray.push( {boxLabel: checkInfo[0], name: checkInfo[1]});
      else
         itemsArray.push({boxLabel: checkInfo[0], name: checkInfo[1], checked: eval(checkInfo[2])});
  }

  var checkboxGroupField = new Ext.form.CheckboxGroup({
        id:field.id,
        xtype: 'checkboxgroup',
        fieldLabel: label,
        itemCls: 'x-check-group-alt',
        // Put all controls in a single column with width 100%
        columns: 1,
        items: itemsArray
  });

  formField[u]={
             colspan: /*numberColsField*/colSpan*numberColsField,
             layout: "form",
             items: [checkboxGroupField]
  };
  if(field.onChange)
     checkboxGroupField.addListener('check', eval(field.onChange));
  return(formField);
}

function generateRadioGroupField(field){
  var formField=new Array();
  var colSpan=0;
  if (field.colSpan)
      colSpan=(parseFloat(field.colSpan)-1)*numberColsField;
  var u=0;
  if(colSpan>0){
    formField[0]={
        colspan: colSpan,
        html: "&nbsp;"
    };
    u++;
  }

  var radioLabels=field.labelList.split(",");
  var radioValues=field.valueList.split(",");
  var checked=false;
  var items= new Array();
  var radioLabel;
  for(var i=0; i<radioLabels.length;i++){
      if(field.valueCheked == radioValues[i])
          checked=true;
      if(field.localization)
         radioLabel=field.localization.getLocalMessage(radioLabels[i]); 
      else
         radioLabel=radioLabels[i];
      items.push({
          xtype:'radio',
          hideLabel: true,
          checked: checked,
          name: field.id,
          boxLabel: radioLabel,
          value: radioValues[i]
      });
      checked=false;
  }
  
  formField[u]={
             colspan: numberColsField,
             layout: "form",
             items: items
  };                  
  return(formField);    
}

function generateNumericField(field){
  var formField=new Array(), size="20";
  if (field.size)
      size=field.size;
  var colSpan=0;
  if (field.colSpan)
      colSpan=(parseFloat(field.colSpan)-1)*numberColsField;
  var u=0;
  if(colSpan>0){
    formField[0]={
        colspan: colSpan,
        html: "&nbsp;"
    };
    u++;
  }

  var allowBlank=true;
  if(field.allowBlank == "false")
     allowBlank=false; 
 
  var onchange="";
  if(!allowBlank)
     onchange+="_formObj_[_formObj_.length-1].onChangeFieldControlMandatory();"; 
  if(field.onChange)
    onchange+=field.onChange;

  var label;
  if(field.localization && field.label!="" && field.label){
    label=field.localization.getLocalMessage(field.label);
  }else
   label=field.label;

  formField[u]={
             colspan: numberColsField+colSpan,
             layout: "form",
             items: [new Ext.form.NumberField({
				name: field.name,
                                autoCreate : {
                                    tag: "input", 
                                    id: field.id,
                                    type: "text", 
                                    onchange: onchange,  
                                    size: size, 
                                    autocomplete: "off"
                                },
                                decimalSeparator: field.decimalSeparator,
                                decimalPrecision : field.decimalPrecision,
                                value: field.value,
                                hideLabel: field.hideLabel,
                                disabled: field.disabled,
                                hidden: field.hidden,
                                id: field.id,
                                labelStyle: field.labelStyle,
                                labelSeparetor: field.labelSeparetor,
				fieldLabel: label,
                                grow: field.grow,
                                msgTarget : 'qtip',
                                vtype: field.vtype,
                                vtypeText: field.vtypeText,
                                allowBlank: allowBlank
			})]
  };                  
  return(formField);  
}

function generateNumericRangeField(field){
  var formField=new Array(), size="20";
  if (field.size)
      size=field.size;
  var colSpan=0;
  if (field.colSpan)
      colSpan=(parseFloat(field.colSpan)-1)*numberColsField;
  var u=0;
  if(colSpan>0){
    formField[0]={
        colspan: colSpan,
        html: "&nbsp;"
    };
    u++;
  }

  var allowBlank=true;
  if(field.allowBlank == "false")
     allowBlank=false;

  var onchange="";
  if(!allowBlank)
     onchange+="_formObj_[_formObj_.length-1].onChangeFieldControlMandatory();";
  if(field.onChange)
    onchange+=field.onChange;

  var label;
  if(field.localization && field.label!="" && field.label){
    label=field.localization.getLocalMessage(field.label);
  }else
   label=field.label;

  var minValue_value="", maxValue_value="";
  if(field.value && field.value!=""){
      var splitValue=field.value.split(",");
      minValue_value=splitValue[0];
      maxValue_value=splitValue[1];
  }


  if(label && label!=""){
    formField[u]={
                  colspan: colSpan,
                  layout: "form",
                  items: [new Ext.form.Field({
                                autoCreate: {tag: 'div', cn:{tag:'div'}},
                                id: 'labelRangeNumber'+field.id,
                                hideLabel: true,
                                value: label+":",
                                setValue:function(val) {
                                      this.value = val;
                                      if(this.rendered){
                                          this.el.child('div').update(
                                          '<p>'+this.value+'</p>');
                                      }
                                }
                       })]
                     };
    u++;
  }




  formField[u]={
             colspan: 3,
             layout: "form",
             labelAlign: "top",
             items: [new Ext.form.NumberField({
				name: field.name+"MinValue",
                                autoCreate : {
                                    tag: "input",
                                    id: field.id+"MinValue",
                                    type: "text",
                                    onchange: onchange,
                                    size: size,
                                    autocomplete: "off"
                                },
                                decimalSeparator: field.decimalSeparator,
                                decimalPrecision : field.decimalPrecision,
                                value: minValue_value,
                                hideLabel: eval(field.hideLabel),
                                disabled: field.disabled,
                                hidden: field.hidden,
                                id: field.id+"MinValue",    
                                labelStyle: 'font-size:10px;',
                                labelSeparetor: field.labelSeparetor,
				fieldLabel: "min",
                                grow: field.grow,
                                maxRangeValueID: field.id+"MaxValue",
                                msgTarget : 'qtip',
                                vtype: 'numberrange',
                                vtypeText: field.vtypeText,
                                allowBlank: allowBlank
			})]
  };

  formField[u+1]={
        colspan: 1,
        html: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
    };

  formField[u+2]={
             colspan: 3,
             layout: "form",
             labelAlign: "top",
             items: [new Ext.form.NumberField({
				name: field.name+"MaxValue",
                                autoCreate : {
                                    tag: "input",
                                    id: field.id+"MaxValue",
                                    type: "text",
                                    onchange: onchange,
                                    size: size,
                                    autocomplete: "off"
                                },
                                decimalSeparator: field.decimalSeparator,
                                decimalPrecision : field.decimalPrecision,
                                value: maxValue_value,
                                hideLabel: eval(field.hideLabel),
                                disabled: field.disabled,
                                hidden: field.hidden,
                                id: field.id+"MaxValue",
                                minRangeValueID: field.id+"MinValue",
                                labelSeparetor: field.labelSeparetor,
				fieldLabel: "max",
                                labelStyle: 'font-size:10px;',
                                grow: field.grow,
                                msgTarget : 'qtip',
                                 vtype: 'numberrange',
                                vtypeText: field.vtypeText,
                                allowBlank: allowBlank
			})]
  };
  return(formField);


}

function generateTextAreaField(field){
  var formField=new Array(), rows="4", cols="20";
  if (field.cols)
      cols=field.cols;
  if (field.rows)
      rows=field.rows;
  var colSpan=0;
  if (field.colSpan)
      colSpan=(parseFloat(field.colSpan)-1)*numberColsField;    

  var u=0;
  if(colSpan>0){
    formField[0]={
        colspan: colSpan,
        html: "&nbsp;"
    };
    u++;
  }
  
  var allowBlank=true;
  if(field.allowBlank == "false")
     allowBlank=false; 
 
  var onchange="";
  if(!allowBlank)
     onchange+="_formObj_[_formObj_.length-1].onChangeFieldControlMandatory();"; 
  if(field.onChange)
    onchange+=field.onChange;
  
  var label;
  if(field.localization && field.label!="" && field.label){
    label=field.localization.getLocalMessage(field.label);
  }else
   label=field.label;

  formField[u]={
             colspan: numberColsField+colSpan,
             layout: "form",
             labelAlign: field.labelAlign,
             items: [new Ext.form.TextArea({
				name: field.name,
                                autoCreate : {
                                    tag: "textarea", 
                                    id: field.id,
                                    name: field.name,
                                    onchange: onchange,
                                    cols: cols, 
                                    rows: rows, 
                                    autocomplete: "off"
                                },
                                value: field.value,
                                hideLabel: field.hideLabel,
                                disabled: field.disabled,
                                hidden: field.hidden,
                                id: field.id,
                                labelStyle: field.labelStyle,
                                labelSeparetor: field.labelSeparetor,
				fieldLabel: label,
                                msgTarget : 'qtip',
                                vtype: field.vtype,
                                vtypeText: field.vtypeText,
                                allowBlank:allowBlank
			})]
  };                  
  return(formField);  
}

function generateEditAreaField(field){
  var formField=new Array(), rows="4", cols="20";
  if (field.cols)
      cols=field.cols;
  if (field.rows)
      rows=field.rows;
  var colSpan=0;
  if (field.colSpan)
      colSpan=(parseFloat(field.colSpan)-1)*numberColsField;

  var u=0;
  if(colSpan>0){
    formField[0]={
        colspan: colSpan,
        html: "&nbsp;"
    };
    u++;
  }

  var allowBlank=true;
  if(field.allowBlank == "false")
     allowBlank=false;

  var onchange="";
  if(!allowBlank)
     onchange+="_formObj_[_formObj_.length-1].onChangeFieldControlMandatory();";
  if(field.onChange)
    onchange+=field.onChange;

  var action;
 if(field.action)
    action=field.action;
 else
    action=rootFolder+utilServlet+"?cmd=putFile&type=proxy&fileId="+field.id+"_file";
 var htmlFormValue="<div id='editAreaDIV_"+field.id+"'><form name='formFile_"+field.id+"_editAreaForm' action='"+action+"' method='POST' onsubmit='javascript:onSubmit_editArea_"+field.id+"()' enctype='multipart/form-data' target='iframeMessage_editArea"+field.id+"'>"+
            "<input type='file' id='"+field.id+"_file' name='"+field.id+"_file' value='' width='"+cols+"' />"+ //onchange='javascript:"+onchange+"' onsubmit='javascript:alert('onsubmit')''
             "<input type='submit' name='buttonSubmit_"+field.id+"' value='"+"Load File"+"'/>"+
            "</form><iframe scrolling='no' FRAMEBORDER='0'name='iframeMessage_editArea"+field.id+"' width='0' height='0' marginwidth='0' marginheight='0/></div>";




  var clientManager= new GisClientManager();
  var loadCallback;
  var saveCallback;

  if(field.loadCallback)
     loadCallback=field.loadCallback;
  else{
      loadCallback="editArea_load_"+field.id;
      var callbackLoadFunction= " var editAreaWindow_"+field.id+"=null; \n"+
             " function editArea_load_"+field.id+"(id) { \n"+
             " if(!editAreaWindow_"+field.id+")" +
                    "editAreaWindow_"+field.id+" = new Ext.Window({ "+
                                            " title: 'Edit Area ("+field.id+") : Load Local File',"+
                                            " id: 'editAreaWindow_"+field.id+"',"+
                                            " border: false,"+
                                            " animCollapse : false,"+
                                            " autoScroll : true,"+
                                            " resizable : true,"+
                                            " collapsible: false,"+
                                            " layout: 'fit',"+
                                            " width:  screen.width/3,"+
                                            " height: 70,"+
                                            " closeAction:'hide',"+
                                            " html: \""+htmlFormValue+"\""+
                                        " }); "+
            " editAreaWindow_"+field.id+".show();"+
          //  "editAreaLoader.setValue(id, \"The content is loaded from the load_callback function into EditArea\");\n"+
            "} \n";
      callbackLoadFunction+="function onSubmit_editArea_"+field.id+"() { \n"+
          "setTimeout('loadFileContent_editArea_"+field.id+"()', 500);"+
          "} \n";
      callbackLoadFunction+="function loadFileContent_editArea_"+field.id+"() { \n"+
         
          " if(parent.iframeMessage_editArea"+field.id+".document.getElementById('textarea')) { \n"+
              " var filename=document.getElementById('"+field.id+"_file').value;";
       if(field.isMultiFile)
         callbackLoadFunction+=" var new_file= {id: filename, text: parent.iframeMessage_editArea"+field.id+".document.getElementById('textarea').value, syntax: '"+field.syntax+"'}; "+
            " editAreaLoader.openFile('"+field.id+"', new_file); ";
       else
         callbackLoadFunction+="  editAreaLoader.setValue('"+field.id+"', parent.iframeMessage_editArea"+field.id+".document.getElementById('textarea').value); ";
       
       callbackLoadFunction+=" editAreaWindow_"+field.id+".hide(); " +
          " }else {"+
             " if(parent.iframeMessage_editArea"+field.id+".document.getElementsByTagName('head')[0]) "+
                    " Ext.Msg.show({ "+
                                "title:'Load File: Error',"+
                                "buttons: Ext.Msg.OK,"+
                                "msg: 'Utilis or Custom Service  Exception!',"+
                                "animEl: 'elId',"+
                                "icon: Ext.MessageBox.ERROR"+
                          "}); "+
            " else "+
                " setTimeout('loadFileContent_editArea_"+field.id+"()', 500);"+
          " } \n" +
             
          " } \n";
      clientManager.insertScript(callbackLoadFunction, "EditAreaCallbackLoad_"+field.id);
    }

  if(field.saveCallback)
     saveCallback=field.saveCallback;
  else{
      saveCallback="editArea_save_"+field.id;
      var callbackSaveFunction=" function editArea_save_"+field.id+"(id, content) { \n"+
            
            "alert(\"Here is the content of the EditArea '\"+ id +\"' as received by the save callback function:\\n\"+content);\n"+
            "} \n ";
      clientManager.insertScript(callbackSaveFunction, "EditAreaCallbackSave_"+field.id);
    }

  
  var editAreaLodearFunction="editAreaLoader.init({"+
            		"id: field.id"+	// id of the textarea to transform
			",start_highlight: true"+
			",font_size: '8'";
                        if(field.fontFamily)
                            editAreaLodearFunction+=",font_family: '"+field.fontFamily+"'"
    editAreaLodearFunction+=//",allow_resize: 'y'"+
			",allow_toggle: false"+
                        ",word_wrap: true"+
			",language: 'en'"+ //change for localization
			",syntax: '"+field.syntax+"'"+
			",toolbar: '"+field.toolbar+"'"+
			",load_callback: '"+loadCallback+"'"+
			",save_callback: '"+saveCallback+"'";
                         if(field.defaultFiles || field.value){
                           var eA_load_callback=" function editAreaLoaded"+field.id+" () { \n";
                                                  if(field.defaultFiles){
                                                     eA_load_callback+=" var defaultFiles="+field.defaultFiles+"; \n"+
                                                     "for(var i=0; i<defaultFiles.length; i++){ \n"+
                                                        " if(defaultFiles[i].loadURL){ \n"+
                                                            "var setEditArea=function(response){ \n"+
                                                                 " if(!response){ \n"+
                                                                          "Ext.Msg.show({ \n"+
                                                                                "title:'Load Content: Error', \n"+
                                                                                "buttons: Ext.Msg.OK, \n"+
                                                                                "msg: 'Service Exception!', \n"+
                                                                                "animEl: 'elId', \n"+
                                                                                "icon: Ext.MessageBox.ERROR \n"+
                                                                          "}); \n"+
                                                                      "}else{ \n"+
                                                                              " defaultFiles[i].text=response; \n";
                                                                  if(field.isMultiFile)
                                                                     eA_load_callback+="editAreaLoader.openFile('"+field.id+"', defaultFiles[i]); \n";
                                                                  else
                                                                     eA_load_callback+="editAreaLoader.setValue('"+field.id+"', defaultFiles[i].text); \n";
                                                   eA_load_callback+="} \n"+
                                                            " }; \n"+
                                                             "var setEditAreaTimeOut=function(){ \n"+
                                                                 "Ext.Msg.show({ \n"+
                                                                    "title:'Load Content: Error', \n"+
                                                                    "buttons: Ext.Msg.OK, \n"+
                                                                    "msg: 'Request TIME-OUT!', \n"+
                                                                    "animEl: 'elId', \n"+
                                                                    "icon: Ext.MessageBox.ERROR \n"+
                                                                "}); \n"+
                                                             "};"+
                                                            "var onSubmit=sendXmlHttpRequestTimeOut('GET', " +
                                                                "defaultFiles[i].loadURL, " +
                                                                "false, null, 80000, setEditArea, setEditAreaTimeOut,null); "+
                                                       "} else \n";
                                                       if(field.isMultiFile)
                                                          eA_load_callback+="editAreaLoader.openFile('"+field.id+"', defaultFiles[i]); \n";
                                                       else
                                                          eA_load_callback+="editAreaLoader.setValue('"+field.id+"', defaultFiles[i].text); \n";
                             eA_load_callback+=" } \n";
                                      }else
                                        eA_load_callback+=" var defaultFiles='"+field.value+"'; \n"+
                                                            "editAreaLoader.setValue('"+field.id+"', defaultFiles); \n";
                        eA_load_callback+="\n }";

                        clientManager.insertScript(eA_load_callback, "EditAreaCallbackLoad_"+field.id);
                        editAreaLodearFunction+=",EA_load_callback: 'editAreaLoaded"+field.id+"'";
                      }
                        if(field.syntaxSelectionAllow)
                          editAreaLodearFunction+=",syntax_selection_allow: '"+field.syntaxSelectionAllow+"'"
                        if(field.isMultiFile)
                          editAreaLodearFunction+=",is_multi_files: '"+field.isMultiFile+"'"
                        if(field.plugins)
                            editAreaLodearFunction+=",plugins: '"+field.plugins+"'"
                        if(field.charmapDefault)
                            editAreaLodearFunction+=",charmap_default: '"+field.charmapDefault+"'"
			
   editAreaLodearFunction+="});";



  eval(editAreaLodearFunction);

  var label;
  if(field.localization && field.label!="" && field.label){
    label=field.localization.getLocalMessage(field.label);
  }else
   label=field.label;

 
  
  formField[u]={
             colspan: numberColsField+colSpan,
             layout: "form",
             items: [new Ext.form.Field({
				name: field.name,
                                autoCreate : {
                                    tag: "textarea",
                                    id: field.id,
                                    name: field.name,
                                    //onchange: onchange,
                                    cols: cols,
                                    rows: rows,
                                    autocomplete: "off"
                                },
                                //value: eval(field.defaultFiles),
                                hideLabel: field.hideLabel,
                                disabled: field.disabled,
                                hidden: field.hidden,
                                id: field.id,
                                fieldType: "editarea",
                                labelStyle: field.labelStyle,
                                labelSeparetor: field.labelSeparetor,
				fieldLabel: label,
                                msgTarget : 'qtip',
                                multipleFile: field.isMultiFile,
                                vtype: field.vtype,
                                vtypeText: field.vtypeText,
                                getEditorValue: function(){
                                  if(this.multipleFile){
                                    return(editAreaLoader.getAllFiles(field.id));
                                  }else
                                    return(editAreaLoader.getValue(field.id));
                                },
                                //objValue String for single File
                                // or Object
                                 /*   *  id : (required) A string that will identify the file. it's the only required field.
                                      Type: String
                                    * title : (optionnal) The title that will be displayed in the tab area.
                                      Type: String
                                      Default: set with the id field value
                                    * text : (optionnal) The text content of the file.
                                      Type: String
                                      Default: ""
                                    * syntax : (optionnal) The syntax to use for this file.
                                      Type: String
                                      Default: ""
                                    * do_highlight : (optionnal) Set if the file should start highlighted or not
                                      Type: String
                                      Default: ""*/
                                // For multiple File
                                setEditorValue: function(objValue){
                                  if(this.multipleFile){
                                     for(var i=0; i<objValue.length; i++){
                                        editAreaLoader.openFile(field.id, objValue[i]);
                                     }
                                  }else
                                     editAreaLoader.setValue(field.id,objValue);
                                },
                                allowBlank:allowBlank
			})]
  };



  return(formField);
}




function generateBBOXField(field){
  var bboxformArray=new Array();
  var colSpan=0,size="15";
  if (field.size)
      size=field.size;
  if (field.colSpan)
      colSpan=(parseFloat(field.colSpan))*numberColsField;
  else
      colSpan=numberColsField;

  var u=0;

  var allowBlank=true;
  if(field.allowBlank == "false")
     allowBlank=false;
  var onchange="";
  if(!allowBlank)
     onchange+="_formObj_[_formObj_.length-1].onChangeFieldControlMandatory();"; 
  if(field.onChange)
    onchange+=field.onChange;

  var selectionToolbar = new Ext.Toolbar(/*{width: size*6.8}*/);
  var setAOI="function(){var aoiArray=this.currentAOI.split(',');"+
              "document.getElementById('"+field.id+"WestBBOX').value=aoiArray[0];"+
              "document.getElementById('"+field.id+"SouthBBOX').value=aoiArray[1];"+
              "document.getElementById('"+field.id+"EastBBOX').value=aoiArray[2];"+
              "document.getElementById('"+field.id+"NorthBBOX').value=aoiArray[3];"+
              "document.getElementById('"+field.id+"WestBBOX').focus();"+
              "document.getElementById('"+field.id+"SouthBBOX').focus();"+
              "document.getElementById('"+field.id+"EastBBOX').focus();"+
              "document.getElementById('"+field.id+"NorthBBOX').focus();"+
              "document.getElementById('"+field.id+"SouthBBOX').focus();"+
              onchange+
              "}";
  var maptool;
  if(field.map)
     maptool=field.map;
  else 
     maptool="map";

  /* aoiName: inputFormElements[i].getAttribute("aoiName"),
                    aoiColor: inputFormElements[i].getAttribute("aoiColor"),
                    aoiWidth: parseInt(inputFormElements[i].getAttribute("aoiWidth")),
     *this.aoiBorderColor=style.aoiBorderColor;
        this.aoiBorderWidth=style.aoiBorderWidth;
     */
  var aoiName="";
  var aoiStyle="";
 


  if(field.aoiName)
     aoiName=", aoiName: '"+field.aoiName+"'";

  if(field.aoiColor){
     aoiStyle="aoiBorderColor: '"+field.aoiColor+"'";

  }

  if(field.aoiWidth){
      if(field.aoiColor)
        aoiStyle+=", ";
     aoiStyle+="aoiBorderWidth: "+field.aoiWidth;
  }
  
  if(field.aoiColor || field.aoiWidth)
     aoiStyle=", aoiStyle: {"+aoiStyle+"}";

  var button="new WebGIS.MapAction.SelectAOI({map: "+maptool+", onChangeAOI:"+setAOI+aoiName+aoiStyle+"})";


  var buttons=new Array();
  buttons.push(button);
  
  var labels=new Array();
  if(!field.bboxLabels){
     labels.push("NORTH");
     labels.push("WEST");
     labels.push("EAST");
     labels.push("SOUTH");
  }else{
    var fieldlabelsSplit=field.bboxLabels.split(',');
    if(field.localization)
      for(var x=0; x<fieldlabelsSplit.length; x++){
         labels.push(field.localization.getLocalMessage(fieldlabelsSplit[x])); 
      }  
    else
      labels=fieldlabelsSplit;
  }
  
  
  var label;
  if(field.localization && field.label!="" && field.label){
    label=field.localization.getLocalMessage(field.label);
  }else
   label=field.label;

  if(!field.hideLabel){
      bboxformArray[u]={
                        colspan: colSpan,
                        layout: "form",
                        items: [new Ext.form.Field({
                                autoCreate: {tag: 'div', cn:{tag:'div'}},
                                id: 'labelAOIId',
                                hideLabel: true,
                                value: label+":",
                                setValue:function(val) {
                                      this.value = val;
                                      if(this.rendered){
                                          this.el.child('div').update(
                                          '<p>'+this.value+'</p>');
                                      }
                                }
                       })]
                     };
   u=u+1;
  }

   bboxformArray[u]={
      colspan: 1,
      layout: "form",
        html: "&nbsp;"
  };
  bboxformArray[u+1]={
                    colspan: 3,
                    layout: "form",
                    labelAlign: "top",
                    items: [new Ext.form.NumberField({
                                autoCreate : {
                                    tag: "input", 
                                    id: field.id+'NorthBBOX',
                                    type: "text",
                                    onchange: onchange,
                                    size: size, 
                                    autocomplete: "off"
                                },
                                fieldLabel: labels[0],
                                vtype: 'latitude',
                                msgTarget : 'qtip',
                                decimalSeparator: field.decimalSeparator,
                                decimalPrecision : field.decimalPrecision,
                                name: field.id+"North",
                                id: field.id+'NorthBBOX',
                                labelStyle: 'font-size:8px;',
                                hideLabel : false,
                                value: field.value,
                                allowBlank:allowBlank,
                                validationEvent : 'change'
                          
                          })]
                  };

 bboxformArray[u+2]={
        colspan: colSpan-4,
        html: "&nbsp;"
    };
 

 bboxformArray[u+3]={
                   colspan: 1,
                   layout: "form",
                   labelAlign: "top",
                   items: [new Ext.form.NumberField({
                                name: field.id+"West",
                                autoCreate : {
                                    tag: "input", 
                                    id: field.id+'WestBBOX',
                                    onchange: onchange,
                                    type: "text", 
                                    size: size, 
                                    autocomplete: "off"
                                },
                                vtype: 'longitude',
                                msgTarget : 'qtip',
                                decimalSeparator: field.decimalSeparator,
                                decimalPrecision : field.decimalPrecision,
                                fieldLabel: labels[1],
                                id: field.id+'WestBBOX',
                                labelStyle: 'font-size:8px;',
                                hideLabel : false,
                                value: field.value,
                                allowBlank:allowBlank,
                                validationEvent : 'change'
                                
			})]
                 };    
  var html="";
            
supportToolbars.push({toolbar: selectionToolbar, id:field.id+'BBOXbar', buttons: buttons});

  html="<div id='"+field.id+"BBOXbar'></div>";

 bboxformArray[u+4]={
        colspan: 3,
        layout: "form",
        html: html
    };


  bboxformArray[u+5]={
                   colspan: 1, 
                   layout: "form",
                   labelAlign: "top",
                   items: [new Ext.form.NumberField({
                                name: field.id+"East",
                                id: field.id+'EastBBOX',
                                autoCreate : {
                                    tag: "input", 
                                    id: field.id+'EastBBOX',
                                    type: "text", 
                                    onchange: onchange,
                                    size: size, 
                                    autocomplete: "off"
                                },
                                vtype: 'longitude',
                                msgTarget : 'qtip',
                                decimalSeparator: field.decimalSeparator,
                                decimalPrecision : field.decimalPrecision,
                                fieldLabel: labels[2],
                                labelStyle: 'font-size:8px;',
                                hideLabel : false,
                                value: null,
                                allowBlank:allowBlank,
                                validationEvent : 'change'
			})]
                  };   
  
  bboxformArray[u+6]={
      colspan: colSpan-5,
      html: "&nbsp;"
  };

    bboxformArray[u+7]={
      colspan: 1,
      layout: "form",
        html: "&nbsp;"
  };
  
  bboxformArray[u+8]={
                   colspan: 3,
                   layout:'form',
                   labelAlign: "top",
                   items: [new Ext.form.NumberField({
                                name: field.id+"South",
                                autoCreate : {
                                    tag: "input", 
                                    id: field.id+'SouthBBOX',
                                    type: "text", 
                                    onchange: onchange,
                                    size: size, 
                                    autocomplete: "off"
                                },
                                id: field.id+'SouthBBOX',
                                vtype: 'latitude',
                                msgTarget : 'qtip',
                                decimalSeparator: field.decimalSeparator,
                                decimalPrecision : field.decimalPrecision,
                                fieldLabel: labels[3],
                                hideLabel : false,
                                labelStyle: 'font-size:8px;',
                                value: field.value,
                                allowBlank:allowBlank,
                                validationEvent : 'change'    
                         })]
                  };

 bboxformArray[u+9]={
      colspan: colSpan-4,
      html: "&nbsp;"
  };
 
  return(bboxformArray);
}

function generatePercentageField(field){
 var percentageFormArray=new Array();
 var colSpan=0;
  if (field.colSpan)
      colSpan=(parseFloat(field.colSpan)-1)*numberColsField;
 var size=parseFloat(field.decimalPrecision)+5;
 var u=0;
  if(colSpan>0){
    percentageFormArray[0]={
        colspan: colSpan,
        html: "&nbsp;"
    };
    u++;
  }
  var allowBlank=true;
  if(field.allowBlank == "false")
     allowBlank=false; 
 
  var onchange="";
  if(!allowBlank)
     onchange+="_formObj_[_formObj_.length-1].onChangeFieldControlMandatory();"; 
  if(field.onChange)
    onchange+=field.onChange;

  var label;
  if(field.localization && field.label!="" && field.label){
    label=field.localization.getLocalMessage(field.label);
  }else
   label=field.label;

  percentageFormArray[u]={
                    colspan: 2,
                    layout: "form",
                    items: [new Ext.form.NumberField({
                                fieldLabel: field.label,
                                vtype: 'percentage',
                                msgTarget : 'qtip',
                                decimalSeparator: field.decimalSeparator,
                                decimalPrecision : field.decimalPrecision,
                                name: field.name,
                                id: field.id,
                                autoCreate : {
                                    tag: "input", 
                                    id: field.id,
                                    type: "text",
                                    onchange: onchange,  
                                    size: size, 
                                    autocomplete: "off"
                                },
                                allowBlank:allowBlank,
                                value: field.value,
                                hideLabel: field.hideLabel,
                                disabled: field.disabled,
                                hidden: field.hidden,
                                labelStyle: field.labelStyle,
                                labelSeparetor: field.labelSeparetor,
				fieldLabel: label,
                                vtypeText: field.vtypeText
                          })]
                  };   
                  
   percentageFormArray[u+1]={
                    colspan: 1,
                    layout: "form",
                    items: [new Ext.form.Field({    
                            autoCreate: {tag: 'div', cn:{tag:'div'}},
                            id: 'labelPercentage'+field.id,
                            hideLabel: true,
                            value: "&nbsp;%",
                            setValue:function(val) { 
                                  this.value = val;
                                  if(this.rendered){
                                      this.el.child('div').update(
                                      '<p>'+this.value+'</p>');   
                                  }
                            }
                   })]
                 };                  
  return (percentageFormArray);
}

function generateComboField(field){
 var colSpan=0,formField=new Array();
  if (field.colSpan)
      colSpan=(parseFloat(field.colSpan)-1)*numberColsField;
  else
      colSpan=1;
 if(field.store == 'VALUES')
    var mode='local';

 var tooltip=null;

 if(field.tooltip){
    tooltip=new Ext.ToolTip({
        html: field.tooltipDefaultMessage,
        setHtml: function (newHtml){
          this.html=newHtml;
          Ext.QuickTips.init();
        },
        //title: "tooltip"+field.id,
        autoHide: true
       /* closable: true,*/
       // draggable:true
    });
    onchangeFunct="";

 }

 var store;

 if(field.storeFields && field.storeData)
    store = new Ext.data.SimpleStore({
        id: "store"+field.id,
        fields: field.storeFields,
        data : field.storeData
      });
  else
    if(field.getStoreMethod)
       store=eval(field.getStoreMethod);

  var allowBlank=true;
  if(field.allowBlank == "false")
     allowBlank=false;

   var onchange="skip";
 /* if(!allowBlank)
     onchange+="_formObj_[_formObj_.length-1].onChangeFieldControlMandatory();"; */
  if(field.onChange)
    onchange=field.onChange;





  var label;
  if(field.localization && field.label!="" && field.label){
    label=field.localization.getLocalMessage(field.label);
  }else
   label=field.label;

  var comboField=new Ext.form.ComboBox({
                            store: store,
                            autoShow: true,
                            storeFields: field.storeFields,
                            displayField: field.storeFields[0],
                            id: field.id,
                            name: field.name,
                            msgTarget : 'qtip',
                            typeAhead: true,
                            tooltip: tooltip,
                            listeners: {
                                afterrender: function() {
                                   if(this.tooltip)
                                       this.tooltip.initTarget(this.container.id);
                                },
                               select: function() {
                                   
                                   if(this.tooltip){
                                       this.tooltip.destroy();
                                       this.tooltip=new Ext.ToolTip({
                                            html: this.getValueInformation("description"),
                                            setHtml: function (newHtml){
                                              this.html=newHtml;

                                            },
                                            //title: "tooltip"+field.id,
                                            autoHide: true
                                           /* closable: true,*/
                                           // draggable:true
                                        });
                                        Ext.QuickTips.init();
                                   }

                                }},

                            disabled: field.disabled,
                            mode: mode,
                            colspan: numberColsField,
                            autoCreate: {tag: "input",
                                         type: "text",
                                         //onchange: onchange,
                                         id:field.id,
                                         size: field.size,
                                         autocomplete: "on"},
                            fieldLabel: label,
                            hideLabel: field.hideLabel,
                            triggerAction: 'all',
                            stateful: false,
                            emptyText: label,
                            selectOnFocus:true,
                            arrayStore: field.storeData,
                            allowBlank:allowBlank,
                            getValueInformation: function(infoValue){
                                var i;

                                for(i=0;i<this.store.getTotalCount();i++){
                                    if(this.store.getAt(i).get(this.displayField) == this.value)
                                       return(this.store.getAt(i).get(infoValue));
                                }
                                return(null);
                            },
                            setStore: function(newStoreData,newstoreFields,newDisplayField){
                                var storeF;
                                if(newstoreFields){
                                  storeF=newstoreFields;
                                  this.storeFields=newDisplayField;
                                }
                                else
                                  storeF=this.storeFields;
                                this.arrayStore=newStoreData;
                                this.storeFields=storeF;
                                var newStore = new Ext.data.SimpleStore({
                                        id: "store"+this.id,
                                        fields: storeF,
                                        data : newStoreData
                                });
                                this.bindStore(newStore);
                            }


                    });
  var u=0;
 /* if(colSpan>0){
    formField[0]={
        colspan: colSpan,
        html: "&nbsp;"
    };
    u++;
  } */
  formField[u] = {
             colspan: /*numberColsField*/colSpan*numberColsField,
             layout: "form",
             items: [comboField]
 };

 /*if(onRenderFunct)
 comboField.on('afterrender', eval(onRenderFunct));*/
 if(onchange!="")
    comboField.on('select', eval(onchange));
 if(field.value)
    comboField.setValue(field.value);
 return(formField);
}

function generateTimeStepField(field){
  var formField=new Array();
  var colSpan=0;
  if (field.colSpan)
      colSpan=(parseFloat(field.colSpan)-1)*numberColsField;
  var hideLabel=false;
  if(!field.label)
     hideLabel=true; 
  var u=0;
  if(colSpan>0){
    formField[0]={
        colspan: colSpan,
        html: "&nbsp;"
    };
    u++;
  }  
  
  var label;
  if(field.localization && field.label && field.label!=""){
    label=field.localization.getLocalMessage(field.label);
  }else
   label=field.label;

  formField[u]={
             colspan: numberColsField,
             layout: "form",
             items:[new Ext.form.TimeField({
                        fieldLabel: label,
                        hideLabel: hideLabel,
                        change: eval(field.onChange),
                        name: field.name,
                        format: field.format,
                        allowBlank:field.allowBlank
                    })]
           };
  return(formField);  
}

function generateTimeField(field){
  var hStore=new Array();
  var mStore=new Array();
  var i;
  var colSpan=numberColsField;
  if (field.colSpan)
      colSpan=(parseFloat(field.colSpan)-1)*numberColsField;
  var maxH;

  var splitFormat=field.format.split(':');
  if(splitFormat[0].indexOf('H')>-1)
     maxH=24;
  else
     maxH=12;

  for(i=0;i<maxH;i++)
      if(i<10)
        hStore[i]="0"+i;
      else
        hStore[i]=i;
  for(i=0;i<60;i++)
      if(i<10)
        mStore[i]="0"+i;
      else
        mStore[i]=i;
  var size="3";
  var timeCombo= new Array();
  var u=0;
  var msvalue="";
  if(field.value){
     var temp=field.value.split(":");
     if(temp.length==0){
        temp=new Array();
        temp[0]=field.value
     }
     if(temp[temp.length-1].indexOf('.')>=0){
      var temp2=temp[temp.length-1].split('.');
      temp[temp.length-1]=temp2[0];
      msvalue=temp2[1];
    }
  }
  var allowBlank=true;
  if(field.allowBlank == "false")
     allowBlank=false;

  var onchange="";
  if(!allowBlank)
     onchange+="_formObj_[_formObj_.length-1].onChangeFieldControlMandatory();";
  if(field.onChange)
    onchange+=field.onChange;

  timeCombo[u]={
                colspan: 1,
                layout: "form",
                labelAlign: "top",
                items: [new Ext.form.ComboBox({
                            store: hStore,
                            typeAhead: true,
                            mode: 'local',
                            colspan: 1,
                            emptyText: "hh",
                            labelStyle: 'font-size:8px;',
                            id: 'h'+field.id,
                            name: 'h'+field.id,
                            autoCreate: {tag: "input", type: "text", id:'h'+field.id, size: size, onchange: onchange, autocomplete: "off"},
                            fieldLabel: 'H',
                            value: null,
                            triggerAction: 'all',
                            selectOnFocus:true,
                            getValueInformation: function(infoValue){

                                return(this.value);
                            },
                            allowBlank:allowBlank
                    })]
                };
  timeCombo[u+1]={
                    colspan: 1,
                    valign:'BOTTOM',
                    layout: "form",

                    items: [new Ext.form.Field({
                            autoCreate: {tag: 'div', cn:{tag:'div'}},
                            id: 'labelTime'+field.id,
                            hideLabel: true,
                            height: 10,
                            value: "&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;",
                            setValue:function(val) {
                                  this.value = val;
                                  if(this.rendered){
                                      this.el.child('div').update(
                                      '<p>   '+this.value+'   </p>');
                                  }
                            }
                   })]
                 };
  timeCombo[u+2]={
                colspan: 1,
                layout: "form",
                labelAlign: "top",
                items: [new Ext.form.ComboBox({
                            store: mStore,
                            typeAhead: true,
                            colspan: 1,
                            emptyText: "mm",
                            labelStyle: 'font-size:7px;',
                            id: 'm'+field.id,
                            name: 'm'+field.id,
                            vtype: 'minutes',
                            mode: 'local',
                            value: null,
                            autoCreate: {tag: "input", type: "text", id:'m'+field.id, onchange: onchange, size: size, autocomplete: "off"},
                            fieldLabel: 'M',
                            triggerAction: 'all',
                            selectOnFocus:true,
                            getValueInformation: function(infoValue){

                                return(this.value);
                            },
                            allowBlank:allowBlank
                       })]
                };
  if(field.seconds){
    timeCombo[u+3]={
                    colspan: 1,
                    layout: "form",

                    items: [new Ext.form.Field({
                            autoCreate: {tag: 'div', cn:{tag:'div'}},
                            id: 'labelTimeSec'+field.id,
                            hideLabel: true,
                            value: "&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;",
                            setValue:function(val) {
                                  this.value = val;
                                  if(this.rendered){
                                      this.el.child('div').update(
                                      '<p>   '+this.value+'   </p>');
                                  }
                            }
                   })]
                 };
    timeCombo[u+4]={
                colspan: 1,
                layout: "form",
                labelAlign: "top",
                items: [new Ext.form.ComboBox({
                            store: mStore,
                            typeAhead: true,
                            colspan: 1,
                            emptyText: "ss",
                            labelStyle: 'font-size:7px;',
                            id: 's'+field.id,
                            name: 's'+field.id,
                            mode: 'local',
                            value: null,
                            vtype: 'seconds',
                            autoCreate: {tag: "input", type: "text", id:'s'+field.id, onchange: onchange, size: size, autocomplete: "off"},
                            fieldLabel: 'S',
                            triggerAction: 'all',
                            selectOnFocus:true,
                            getValueInformation: function(infoValue){

                                return(this.value);
                            },
                            allowBlank:allowBlank
                       })]
                };
   u=u+2;
  }

  if(field.secondsDiv){
    timeCombo[u+3]={
                    colspan: 1,
                    layout: "form",
                    items: [new Ext.form.Field({
                            autoCreate: {tag: 'div', cn:{tag:'div'}},
                            id: 'labelTimeSecDiv'+field.id,
                            hideLabel: true,
                            value: "&nbsp;&nbsp;&nbsp;.&nbsp;&nbsp;&nbsp;",
                            setValue:function(val) {
                                  this.value = val;
                                  if(this.rendered){
                                      this.el.child('div').update(
                                      '<p>   '+this.value+'   </p>');
                                  }
                            }
                   })]
                 };
    timeCombo[u+4]={
                colspan: 1,
                layout: "form",
                labelAlign: "top",
                items: [new Ext.form.NumberField({
                                autoCreate : {
                                    tag: "input",
                                    id: field.id+'secondsDiv',
                                    type: "text",
                                    //onchange: "javascript:"+field.onChange,
                                    size: size,
                                    autocomplete: "off"
                                },
                                fieldLabel: "mS",
                                value: msvalue,
                                vtype: 'millseconds',
                                msgTarget : 'qtip',
                                decimalSeparator: field.decimalSeparator,
                                decimalPrecision : field.decimalPrecision,
                                name: 'ms'+field.id,
                                id: 'ms'+field.id,
                                labelStyle: 'font-size:8px;',
                                hideLabel : false
                          })]
                };
    u=u+2;
  }

  var currentLength=timeCombo.length;

  timeCombo[u+3]={
                colspan: colSpan-timeCombo.length,
                layout: "form",
                labelAlign: "top",
                html: ""
               };

  if(field.value){
    var z=u;
    for(var index=0; index<temp.length;index++){
      if(timeCombo[z]){
          timeCombo[z].items[0].setValue(temp[index]);
          z=z+2;
      }
    }
  }
  return(timeCombo);
}

function generateRangeTimeField(field){
  var hStore=new Array();
  var mStore=new Array();
  var i,maxH;
  var colSpan=0;
  if (field.colSpan)
      colSpan=(parseFloat(field.colSpan)-1)*numberColsField;
  else
      colSpan=numberColsField;

  var splitFormat=field.format.split(':');
  if(splitFormat[0]=='H')
     maxH=24;
  else
     maxH=12;

  for(i=0;i<maxH;i++)
      if(i<10)
        hStore[i]="0"+i;
      else
        hStore[i]=i;

  for(i=0;i<60;i++)
      if(i<10)
        mStore[i]="0"+i;
      else
        mStore[i]=i;

  var size="3";

  var timeCombo= new Array();
  var u=0;

  var msvalue="";
  if(field.value){
     var temp=field.value.split(":");
     if(temp.length==0){
        temp=new Array();
        temp[0]=field.value
     }
     if(temp[temp.length-1].indexOf('.')>=0){
      var temp2=temp[temp.length-1].split('.');
      temp[temp.length-1]=temp2[0];
      msvalue=temp2[1];
    }
  }
  var allowBlank=true;
  if(field.allowBlank == "false")
     allowBlank=false;

  var onchange="";
  if(!allowBlank)
     onchange+="_formObj_[_formObj_.length-1].onChangeFieldControlMandatory();";
  if(field.onChange)
    onchange+=field.onChange;


  timeCombo[u]={
                colspan: colSpan,
                layout: "form",
                items: [new Ext.form.Field({
                            autoCreate: {tag: 'div', cn:{tag:'div'}},
                            labelStyle: 'font-size:8px;',
                            id: 'labelStartTime'+field.id,
                            hideLabel: true,
                            value: field.labelStart,
                            setValue:function(val) {
                                  this.value = val;
                                  if(this.rendered){
                                      this.el.child('div').update(
                                      '<p>   '+this.value+':&nbsp;   </p>');
                                  }
                            }
                    })]
                 };
  timeCombo[u+1]={
                colspan: 1,
                layout: "form",
                labelAlign: "top",
                items: [new Ext.form.ComboBox({
                            store: hStore,
                            typeAhead: true,
                            vtype: 'timerange',
                            msgTarget : 'qtip',
                            mode: 'local',
                            colspan: 1,
                            maxH: maxH,
                            emptyText: "hh",
                            labelStyle: 'font-size:8px;',
                            fieldLabel: "hh",
                            id: 'hStart'+field.id,
                            name: 'hStart'+field.id,
                            isOnChange: true,
                            autoCreate: {tag: "input", type: "text", id:'hStart'+field.id, onchange: onchange, size: size, autocomplete: "off"},
                            hideLabel: field.hideLabel,
                            triggerAction: 'all',
                            selectOnFocus:true,
                            allowBlank:allowBlank,
                            value: null,
                            getValueInformation: function(infoValue){

                                return(this.value);
                            },
                            secondsDiv: field.secondsDiv,
                            mStart:'mStart'+field.id,
                            sStart:'sStart'+field.id,
                            msStart:'msStart'+field.id,
                            hEnd:'hEnd'+field.id,
                            mEnd:'mEnd'+field.id,
                            sEnd:'sEnd'+field.id,
                            msEnd:'msEnd'+field.id
                    })]
                };
  timeCombo[u+2]={
                    colspan: 1,
                    layout: "form",
                    items: [new Ext.form.Field({
                            autoCreate: {tag: 'div', cn:{tag:'div'}},
                            id: 'labelTimeHSeparatorSart'+field.id,
                            hideLabel: true,
                            value: "&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;",
                            setValue:function(val) {
                                  this.value = val;
                                  if(this.rendered){
                                      this.el.child('div').update(
                                      '<p>   '+this.value+'   </p>');
                                  }
                            }
                   })]
                 };
  timeCombo[u+3]={
                colspan: 1,
                layout: "form",
                labelAlign: "top",
                items: [new Ext.form.ComboBox({
                            store: mStore,
                            typeAhead: true,
                            colspan: 1,
                            vtype: 'timerange',
                            msgTarget : 'qtip',
                            labelStyle: 'font-size:8px;',
                            fieldLabel: "mm",
                            id: 'mStart'+field.id,
                            emptyText: "mm",
                            name: 'mStart'+field.id,
                            mode: 'local',
                            isOnChange: true,
                            autoCreate: {tag: "input", type: "text", id:'mStart'+field.id, onchange: onchange, size: size, autocomplete: "off"},
                            hideLabel: field.hideLabel,
                            triggerAction: 'all',
                            secondsDiv: field.secondsDiv,
                            selectOnFocus:true,
                            allowBlank:allowBlank,
                            value: null,
                            getValueInformation: function(infoValue){

                                return(this.value);
                            },
                            hStart:'hStart'+field.id,
                            sStart:'sStart'+field.id,
                            msStart:'msStart'+field.id,
                            hEnd:'hEnd'+field.id,
                            mEnd:'mEnd'+field.id,
                            sEnd:'sEnd'+field.id,
                            msEnd:'msEnd'+field.id
                       })]
                };
   timeCombo[u+4]={
                    colspan: 1,
                    layout: "form",
                    items: [new Ext.form.Field({
                            autoCreate: {tag: 'div', cn:{tag:'div'}},
                            id: 'labelTimeMSeparatorSart'+field.id,
                            hideLabel: true,
                            value: "&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;",
                            setValue:function(val) {
                                  this.value = val;
                                  if(this.rendered){
                                      this.el.child('div').update(
                                      '<p>   '+this.value+'   </p>');
                                  }
                            }
                   })]
                 };
   timeCombo[u+5]={
                colspan: 1,
                layout: "form",
                labelAlign: "top",
                items: [new Ext.form.ComboBox({
                            store: mStore,
                            typeAhead: true,
                            colspan: 1,
                            vtype: 'timerange',
                            msgTarget : 'qtip',
                            id: 'sStart'+field.id,
                            emptyText: "ss",
                            name: 'sStart'+field.id,
                            mode: 'local',
                            isOnChange: true,
                            autoCreate: {tag: "input", type: "text", id:'sStart'+field.id, onchange: onchange, size: size, autocomplete: "off"},
                            hideLabel: field.hideLabel,
                            fieldLabel: "ss",
                            secondsDiv: field.secondsDiv,
                            triggerAction: 'all',
                            selectOnFocus:true,
                            allowBlank:allowBlank,
                            value: null,
                            getValueInformation: function(infoValue){

                                return(this.value);
                            },
                            labelStyle: 'font-size:8px;',
                            hStart:'hStart'+field.id,
                            mStart:'mStart'+field.id,
                            msStart:'msStart'+field.id,
                            hEnd:'hEnd'+field.id,
                            mEnd:'mEnd'+field.id,
                            sEnd:'sEnd'+field.id,
                            msEnd:'msEnd'+field.id
                       })]
                };

   if(field.secondsDiv){
    timeCombo[u+6]={
                    colspan: 1,
                    layout: "form",
                    items: [new Ext.form.Field({
                            autoCreate: {tag: 'div', cn:{tag:'div'}},
                            id: 'labelTimeSecDiv'+field.id,
                            hideLabel: true,
                            value: "&nbsp;&nbsp;&nbsp;.&nbsp;&nbsp;&nbsp;",
                            setValue:function(val) {
                                  this.value = val;
                                  if(this.rendered){
                                      this.el.child('div').update(
                                      '<p>   '+this.value+'   </p>');
                                  }
                            }
                   })]
                 };
    timeCombo[u+7]={
                colspan: 1,
                layout: "form",
                labelAlign: "top",
                items: [new Ext.form.NumberField({
                                autoCreate: {tag: "input", type: "text", id:'msStart'+field.id, onchange: onchange, size: size, autocomplete: "off"},
                                fieldLabel: "ms",
                                value: msvalue,
                                vtype: 'timerange',
                                msgTarget : 'qtip',
                                isOnChange: true,
                                allowBlank:allowBlank,
                                decimalSeparator: field.decimalSeparator,
                                decimalPrecision : field.decimalPrecision,
                                name: 'msStart'+field.id,
                                id: 'msStart'+field.id,
                                secondsDiv: field.secondsDiv,
                                labelStyle: 'font-size:8px;',
                                hideLabel : field.hideLabel,
                                hStart:'hStart'+field.id,
                                mStart:'mStart'+field.id,
                                sStart:'sStart'+field.id,
                                hEnd:'hEnd'+field.id,
                                mEnd:'mEnd'+field.id,
                                sEnd:'sEnd'+field.id,
                                msEnd:'msEnd'+field.id
                          })]
                };
    u=u+2;
  }else{
   timeCombo[u+6]={
                    colspan: 2,
                    layout: "form",
                    html:""
                 };
    u++;
  }
  timeCombo[u+6]={
                    colspan: colSpan,
                    layout: "form",
                    items: [new Ext.form.Field({
                            autoCreate: {tag: 'div', cn:{tag:'div'}},
                            id: 'labelEndTime'+field.id,
                            labelStyle: 'font-size:8px;',
                            hideLabel: true,
                            value: field.labelEnd,
                            setValue:function(val) {
                                  this.value = val;
                                  if(this.rendered){
                                      this.el.child('div').update(
                                      '<p>   '+this.value+':&nbsp;   </p>');
                                  }
                            }
                   })]
                 };

  timeCombo[u+7]={
                colspan: 1,
                layout: "form",
                labelAlign: "top",
                items: [new Ext.form.ComboBox({
                            store: hStore,
                            typeAhead: true,
                            mode: 'local',
                            colspan: 1,
                            maxH: maxH,
                            vtype: 'timerange',
                            labelStyle: 'font-size:8px;',
                            fieldLabel: "hh",
                            msgTarget : 'qtip',
                            isOnChange: true,
                            emptyText: "hh",
                            id: 'hEnd'+field.id,
                            name: 'hEnd'+field.id,
                            secondsDiv: field.secondsDiv,
                            autoCreate: {tag: "input", type: "text", id:'hEnd'+field.id, onchange: onchange, size: size, autocomplete: "off"},
                            hideLabel: field.hideLabel,
                            triggerAction: 'all',
                            value: null,
                            getValueInformation: function(infoValue){

                                return(this.value);
                            },
                            selectOnFocus:true,
                            allowBlank:allowBlank,
                            mStart:'mStart'+field.id,
                            hStart:'hStart'+field.id,
                            sStart:'sStart'+field.id,
                            msStart:'msStart'+field.id,
                            mEnd:'mEnd'+field.id,
                            sEnd:'sEnd'+field.id,
                            msEnd:'msEnd'+field.id
                    })]
                };
  timeCombo[u+8]={
                    colspan: 1,
                    layout: "form",

                    items: [new Ext.form.Field({
                            autoCreate: {tag: 'div', cn:{tag:'div'}},
                            id: 'labelTimeHSeparatorEnd'+field.id,
                            hideLabel: true,
                            value: "&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;",
                            setValue:function(val) {
                                  this.value = val;
                                  if(this.rendered){
                                      this.el.child('div').update(
                                      '<p>   '+this.value+'   </p>');
                                  }
                            }
                   })]
                 };
  timeCombo[u+9]={
                colspan: 1,
                layout: "form",
                labelAlign: "top",
                items: [new Ext.form.ComboBox({
                            store: mStore,
                            typeAhead: true,
                            colspan: 1,
                            labelStyle: 'font-size:8px;',
                            fieldLabel: "mm",
                            id: 'mEnd'+field.id,
                            name: 'mEnd'+field.id,
                            emptyText: "mm",
                            vtype: 'timerange',
                            isOnChange: true,
                            secondsDiv: field.secondsDiv,
                            msgTarget : 'qtip',
                            mode: 'local',
                            autoCreate: {tag: "input", type: "text", id:'mEnd'+field.id, onchange: onchange, size: size, autocomplete: "off"},
                            hideLabel: field.hideLabel,
                            triggerAction: 'all',
                            selectOnFocus:true,
                            value: null,
                            getValueInformation: function(infoValue){

                                return(this.value);
                            },
                            allowBlank:allowBlank,
                            mStart:'mStart'+field.id,
                            hStart:'hStart'+field.id,
                            sStart:'sStart'+field.id,
                            msStart:'msStart'+field.id,
                            hEnd:'hEnd'+field.id,
                            sEnd:'sEnd'+field.id,
                            msEnd:'msEnd'+field.id
                       })]
                };
   timeCombo[u+10]={
                    colspan: 1,
                    layout: "form",

                    items: [new Ext.form.Field({
                            autoCreate: {tag: 'div', cn:{tag:'div'}},
                            id: 'labelTimeMSeparatorEnd'+field.id,
                            hideLabel: true,
                            value: "&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;",
                            setValue:function(val) {
                                  this.value = val;
                                  if(this.rendered){
                                      this.el.child('div').update(
                                      '<p>   '+this.value+'   </p>');
                                  }
                            }
                   })]
                 };
  timeCombo[u+11]={
                colspan: 1,
                layout: "form",
                labelAlign: "top",
                items: [new Ext.form.ComboBox({
                            store: mStore,
                            typeAhead: true,
                            colspan: 1,
                            labelStyle: 'font-size:8px;',
                            fieldLabel: "ss",
                            id: 'sEnd'+field.id,
                            name: 'sEnd'+field.id,
                            emptyText: "ss",
                            vtype: 'timerange',
                            secondsDiv: field.secondsDiv,
                            msgTarget : 'qtip',
                            isOnChange: true,
                            mode: 'local',
                            autoCreate: {tag: "input", type: "text", id:'sEnd'+field.id, onchange: onchange, size: size, autocomplete: "off"},
                            hideLabel: field.hideLabel,
                            triggerAction: 'all',
                            selectOnFocus:true,
                            value: null,
                            getValueInformation: function(infoValue){

                                return(this.value);
                            },
                            allowBlank:allowBlank,
                            mStart:'mStart'+field.id,
                            hStart:'hStart'+field.id,
                            sStart:'sStart'+field.id,
                            msStart:'msStart'+field.id,
                            hEnd:'hEnd'+field.id,
                            mEnd:'mEnd'+field.id,
                            msEnd:'msEnd'+field.id
                       })]
                };
  if(field.secondsDiv){
    timeCombo[u+12]={
                    colspan: 1,
                    layout: "form",
                    items: [new Ext.form.Field({
                            autoCreate: {tag: 'div', cn:{tag:'div'}},
                            id: 'labelTimeSecDivEnd'+field.id,
                            hideLabel: true,
                            value: "&nbsp;&nbsp;&nbsp;.&nbsp;&nbsp;&nbsp;",
                            setValue:function(val) {
                                  this.value = val;
                                  if(this.rendered){
                                      this.el.child('div').update(
                                      '<p>   '+this.value+'   </p>');
                                  }
                            }
                   })]
                 };
    timeCombo[u+13]={
                colspan: 1,
                layout: "form",
                labelAlign: "top",
                items: [new Ext.form.NumberField({
                                autoCreate: {tag: "input", type: "text", id:'msEnd'+field.id, onchange: onchange, size: size, autocomplete: "off"},
                                fieldLabel: "ms",
                                value: msvalue,
                                vtype: 'timerange',
                                msgTarget : 'qtip',
                                isOnChange: true,
                                allowBlank:allowBlank,
                                decimalSeparator: field.decimalSeparator,
                                decimalPrecision : field.decimalPrecision,
                                name: 'msEnd'+field.id,
                                id: 'msEnd'+field.id,
                                labelStyle: 'font-size:8px;',
                                secondsDiv: field.secondsDiv,
                                hideLabel : field.hideLabel,
                                hStart:'hStart'+field.id,
                                mStart:'mStart'+field.id,
                                sStart:'sStart'+field.id,
                                hEnd:'hEnd'+field.id,
                                mEnd:'mEnd'+field.id,
                                sEnd:'sEnd'+field.id,
                                msStart:'msStart'+field.id
                          })]
                };
  }
  return(timeCombo);
}

function generateDateField(field){
 
  var formField=new Array();
  var colSpan=0, size="12";
  if (field.colSpan)
      colSpan=(parseFloat(field.colSpan)-1)*numberColsField;
  var u=0;
  if(colSpan>0){
    formField[0]={
        colspan: colSpan,
        html: "&nbsp;"
    };
    u++;
  }
  if (field.size)
      size=field.size;
  var allowBlank=true;
  if(field.allowBlank == "false")
     allowBlank=false;
  var onchange="";
  if(!allowBlank)
     onchange+="_formObj_[_formObj_.length-1].onChangeFieldControlMandatory();"; 
 
  if(field.onChange)
    onchange+=field.onChange;
  var label;
  if(field.localization && field.label!="" && field.label){
    label=field.localization.getLocalMessage(field.label);
  }else
   label=field.label;
  var dateField=new Ext.form.DateField({
                 autoCreate : {
                               tag: "input", 
                               id: field.id,
                               type: "text",                               
                               onchange: onchange,
                               size: size,                                    
                               autocomplete: "off"
                              },
                     fieldLabel: label,
                     value: field.value,
                     name: field.name,
                     disabled: field.disabled,
                     hideLabel: field.hideLabel,
                     hidden: field.hidden,
                     id: field.id,
                     msgTarget : 'qtip',
                     allowBlank:allowBlank
                    });
  formField[u]={
             colspan: numberColsField+colSpan,
             layout: "form",
             items:[dateField]
           };      

 dateField.on('change', function(){eval(onchange);});    
  
  return(formField);  
}

function generateRangeDateField(field){
  var formField= new Array();
  var colSpan=0,size="12";
  if (field.colSpan)
      colSpan=(parseFloat(field.colSpan)-1)*numberColsField;
  var u=0;
  if(colSpan>0){
    formField[0]={
        colspan: colSpan,
        html: "&nbsp;"
    };
    u++;
  }
  
  if (field.size)
      size=field.size;
  var allowBlank=true;
  if(field.allowBlank == "false")
     allowBlank=false;
  var onchange="";
  if(!allowBlank)
     onchange+="_formObj_[_formObj_.length-1].onChangeFieldControlMandatory();"; 
 
  if(field.onChange)
    onchange+=field.onChange;
  
  var labelStart,labelEnd;
  if(field.localization && field.labelStart!="" && field.labelEnd!="" && field.labelEnd && field.labelStart){
    labelStart=field.localization.getLocalMessage(field.labelStart);
    labelEnd=field.localization.getLocalMessage(field.labelEnd);
  }else{
    labelStart=field.labelStart;
    labelEnd=field.labelEnd;
  }
   
  
  
  var startDate=new Ext.form.DateField({
                        autoCreate : {
                                 tag: "input", 
                                 id: field.id+'StartDate',
                                 type: "text", 
                                 onchange: onchange,
                                 size: size,                                    
                                 autocomplete: "off"
                                },
                        xtype:'datefield',
                        fieldLabel: labelStart,
                        name: field.id+'StartDate',
                        value: null,
                        id: field.id+'StartDate',
                        msgTarget : 'qtip',
                        vtype: 'daterange',
                        allowBlank:allowBlank,
                        endDateField: field.id+'EndDate'});

  var endDate=new Ext.form.DateField({
                        autoCreate : {
                                 tag: "input", 
                                 id: field.id+'EndDate',
                                 type: "text", 
                                 onchange: onchange,
                                 size: size,                                    
                                 autocomplete: "off"
                                },
                        xtype:'datefield',
                        value: null,
                        fieldLabel: labelEnd,
                        name: field.id+'EndDate',
                        id: field.id+'EndDate',
                        msgTarget : 'qtip',
                        vtype: 'daterange',
                        allowBlank:allowBlank,
                        startDateField: field.id+'StartDate'});                      
                              
  formField[u]={
             colspan: numberColsField+colSpan,
             layout: "form",
             items: [startDate,endDate]
           };
  startDate.on('change', function(){eval(onchange);});
  endDate.on('change', function(){eval(onchange);});
  return(formField);  
}  

function generateFileField(field){
  var formField=new Array(), size="20";
  var colSpan=0;
  if (field.colSpan)
      colSpan=(parseFloat(field.colSpan)-1)*numberColsField;
  if (field.size)
      size=field.size;
  
  var u=0;
  if(colSpan>0){
    formField[0]={
        colspan: colSpan,
        html: "&nbsp;"
    };
    u++;
  }   
 var allowBlank=true;
  if(field.allowBlank == "false")
     allowBlank=false;
  var onchange="";
  if(!allowBlank)
     onchange+="_formObj_[_formObj_.length-1].onChangeFieldControlMandatory();"; 
 
  if(field.onChange)
    onchange+=field.onChange;

  var submitLabel;
  if(field.localization && field.submitLabel!="" && field.submitLabel){
    submitLabel=field.localization.getLocalMessage(field.submitLabel);
  }else
   submitLabel=field.submitLabel;

  var fileHtml="<form name='formFile_"+field.id+"' action='"+field.action+"' method='POST' enctype='multipart/form-data' target='"+field.target+"'>"+
            "<input type='file' id='"+field.id+"_file' name='"+field.id+"_file' value='' onchange='javascript:"+onchange+"' width='"+size+"' />"+
             "<input type='submit' name='buttonSubmit_"+field.id+"' value='"+submitLabel+"'/>"+
            "</form>";
     formField[u]={
             colspan: numberColsField,
             layout: "form",
             items: [new Ext.form.Field({
                        autoCreate: {tag: 'div', cn:{tag:'div'}},
                        id: field.id,
                        name: field.id,
                        hideLabel: true,
                        value: fileHtml,
                        setValue:function(val) { 
                            this.value = val;
                            if(this.rendered){
                                this.el.child('div').update(
                                '<p>'+this.value+'</p>');   
                        }
                      }
                   })]
            };

  return(formField);  
}

function generateLabelField(field){
  var formField=new Array();
  var colSpan=0;
  if (field.colSpan)
      colSpan=(parseFloat(field.colSpan)-1)*numberColsField;
  else
      colSpan=1;
  var u=0;

  var defaultValue;
  if(field.htmlValue)
     defaultValue=field.htmlValue;
  else{
     if(field.localization && field.label!="" && field.label){
        defaultValue=field.localization.getLocalMessage(field.value);
      }else
        defaultValue=field.value;
  }

  if(field.divContent){
      var tmp="";
      if(defaultValue)
        tmp=defaultValue;
      defaultValue="<div id=\""+field.divContent+"\">"+tmp+"</div>";
  }

  var label=new Ext.form.Field({
                        autoCreate: {tag: 'div', cn:{tag:'div'}},
                        id: field.id,
                        name: field.id,
                        hideLabel: true,
                        value: defaultValue,
                        setValue:function(val) {
                            this.value = val;
                            if(this.rendered){
                                this.el.child('div').update(
                                '<p>'+this.value+'</p>');
                        }
                      }
                   });


  if(field.height)
     label.height= field.height;

  if(field.divContent)
     label.divContent= field.divContent;

  if(field.storeAttribute)
     label.storeAttribute= field.storeAttribute;


  formField[u]={
             colspan: /*numberColsField*/colSpan*numberColsField,
             layout: "form",
             items: [label]
            };
  return(formField);
}

function generateButtonField(field){
  var colSpan=0;
  var formField= new Array();
  if (field.colSpan)
      colSpan=(parseFloat(field.colSpan)-1)*numberColsField;  
  var parameters= null, paramsplit= new Array();
  
  if(field.handlerParameters){
      var listParameters=field.handlerParameters.substr(1,field.handlerParameters.length-2);
      if(listParameters){   
          parameters= new Array();
          paramsplit=listParameters.split(',');
          if(!paramsplit)
              paramsplit[0]=listParameters;
          var i=0, temp;
          for(i=0;i<paramsplit.length; i++){
              temp=paramsplit[i].split(':');
              parameters[ trim(temp[0], ' ')]=trim(trim(temp[1], " "), "'");
          }
    }
  }
  
  var u=0;
  if(colSpan>0){
    formField[0]={
        colspan: colSpan,
        html: "&nbsp;"
    };
    u++;
  }
 
  var label;
  if(field.localization && field.label!="" && field.label){
    label=field.localization.getLocalMessage(field.label);
  }else
   label=field.label; 

  var button=new Ext.Button({
                  id: field.id,
                  name: field.name,
                  text: label,
                  handler: eval(field.onclickFunction),
                  handlerParm: parameters,
                  disabled: field.disabled,
                  icon: field.icon
              });               
  formField[u]={
                 colspan: numberColsField+colSpan,
                  layout: "form",
                  items: [button]
                };
        
  return(formField);  
}








