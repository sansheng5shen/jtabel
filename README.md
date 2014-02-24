# 文档 

---

基础日历组件，依赖于jquery。

---

## 选项配置


### 必填项

今天

#### today	`String`

最小日期

#### minDate 	`String`

最大日期

#### maxDate	`String`

选择日期

#### selectDate `String`

input 节点id

#### id	`String`



### 可选项

输入框是否只读

####  isReadOnly `Boolean|false`

日历面板个数

####  panelCounts `Number|1`

日历按照月翻步长

#### monthStep	`Number|1`

是否有整月选择

#### isSelectAllMonth `Number|1`

是否只按照周选择

#### isSelectWeek `Boolean|false`

是否点击文档其它区域隐藏日历层

#### isClickDocClose `Boolean|true`

显示位置

#### showPosition `String|left ['left'|'right']`

父节点

#### parentContainer `jQuery|$('body')`

多语言以及日历格式配置

#### language	`object`

````javascript
    lg = {
        to: "至",
        closeBtnTxt: "关闭",
        okBtnTxt: "确定",
        defineTxt: "自定义",
        weekTxt: [ "日", "一", "二", "三", "四", "五", "六" ],
        yearTxt: "年",
        monthTxt: "月",
        separator: "-",
        errorTip: {
            ET1: "时间格式不正确",
            ET2: "开始时间格式不正确",
            ET3: "结束时间格式不正确",
            ET4: "开始时间不能小于最小时间",
            ET5: "结束时间不能大于最大时间",
            ET6: "最小时间不能大于最大时间"
        }
    };
````




## 样式配置


###日历面板日期样式

选中

#### sSelected `String`

选中开始

#### aSelectStart	 `String`

选中结束

#### aSelectEnd `String`

不可选择

#### aDisabled `String`

滑过

#### sHovered `String`


### 按钮样式

滑过

#### hovered `String`

选中

#### hovered `String`

不可选

#### hovered `String`


### 错误提示样式


#### errored	`String`


#### 
## 事件回调,以下为事件回调名字   
      
日历显示前

#### 'calendar.event.showbcb' `Function`

日历显示后

#### 'calendar.event.showcb' `Function`

日历隐藏前

#### 'calendar.event.hidebcb' `Function`

日历隐藏后

#### 'calendar.event.hidecb' `Function`

日历提交

#### 'calendar.event.submit' `Function`

日历取消

#### 'calendar.event.cancle' `Function`

修改输入框
#### 'calendar.event.triggerInput.keyup' `Function`

点击文档隐藏日历
#### 'calendar.event.clickDocClose' `Function`

月向未来
#### 'calendar.event.nextMonth' `Function`

年向未来
#### 'calendar.event.nextYear' `Function`

月向过去
#### 'calendar.event.prevMonth' `Function`

年向过去
#### 'calendar.event.prevYear' `Function`

日期点击
#### 'calendar.event.aTimeClick' `Function`

开始时间小于最小时间
#### 'calendar.event.triggerInput.st_min' `Function`

结束时间小于最小时间
#### 'calendar.event.triggerInput.et_min' `Function`

开始时间大于最大时间
#### 'calendar.event.triggerInput.st_max' `Function`

结束时间大于最大时间
#### 'calendar.event.triggerInput.et_max' `Function`

结束时间小于开始时间
#### 'calendar.event.triggerInput.et_st' `Function`
