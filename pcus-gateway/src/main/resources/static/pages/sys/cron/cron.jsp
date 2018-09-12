<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page import="java.util.Date"%>
<%
	Long time = new Date().getTime();
%>
<jsp:include page="../../common/pages.jsp" />

<style type="text/css">
.line {
	height: 25px;
	line-height: 25px;
	margin: 3px;
	padding-left: 25px;
}

.line input {
	float: left;
	height: 25px;
}

.line .l-text {
	float: left;
}

.line .l-text-wrapper {
	float: left;
}

.l-text-combobox input {
	height: 20px;
}

.line span {
	float: left;
	display: block;
	margin: 0 5 0 5;
}

}
.imp {
	padding-left: 25px;
}

.col {
	width: 95px;
}
</style>

<script src="<c:url value='/js/sys/cron.js'/>?time=<%=time%>"></script>

<div id="layout">
	<!-- 卡片界面 -->
	<div>
		<form id="mainform">
		</form>
	</div>
	<!-- <input id="btn" value="设置图标" type="button">   -->
	<!-- 防止DIV的越界 -->
    <div class="l-clear"></div>

	<div id="navtab" style="width: 99%; hidden; border: 1px solid #D3D3d3;"
		class="liger-tab">
		<div tabid="tab-second" title="秒" lselected="true">
			<div class="line">
				<input type="radio" checked="checked" name="second" onclick="everyTime(this)"><span>每秒&nbsp;&nbsp;&nbsp;&nbsp;允许的通配符[, - * /]</span>
			</div>
			<div class="line">
				<input type="radio" id="secondCycle" name="second" onclick="cycle(this)"> <span>周期&nbsp;&nbsp;&nbsp;&nbsp;从第</span>
				<input value="1" id="secondStart_0"> <span>-</span>
				<input value="2" id="secondEnd_0"> <span>秒，每秒执行一次</span>
			</div>
			<div class="line">
				<input type="radio" id="secondStartOn" name="second" onclick="startOn(this)"> <span>循环&nbsp;&nbsp;&nbsp;&nbsp;从第</span>
				<input value="0" id="secondStart_1"><span>秒开始，每</span>
				<input value="1" id="secondEnd_1"><span>秒执行一次</span>
			</div>
			<div class="line">
				<input type="radio" name="second" id="sencond_appoint"> <span>指定&nbsp;&nbsp;&nbsp;&nbsp;请勾选第几秒</span>
			</div>
			<div class="line secondList">
				<input type="checkbox" value="1">01 <input type="checkbox" value="2">02 <input type="checkbox" value="3">03 
				<input type="checkbox" value="4">04 <input type="checkbox" value="5">05 <input type="checkbox" value="6">06 
				<input type="checkbox" value="7">07 <input type="checkbox" value="8">08 <input type="checkbox" value="9">09 
				<input type="checkbox" value="10">10
				<input type="checkbox" value="11">11 <input type="checkbox" value="12">12 <input type="checkbox" value="13">13
				<input type="checkbox" value="14">14 <input type="checkbox" value="15">15 <input type="checkbox" value="16">16
				<input type="checkbox" value="17">17 <input type="checkbox" value="18">18 <input type="checkbox" value="19">19
				<input type="checkbox" value="20">20
			</div>
			<div class="line secondList">
				<input type="checkbox" value="21">21 <input type="checkbox" value="22">22 <input type="checkbox" value="23">23
				<input type="checkbox" value="24">24 <input type="checkbox" value="25">25 <input type="checkbox" value="26">26
				<input type="checkbox" value="27">27 <input type="checkbox" value="28">28 <input type="checkbox" value="29">29
				<input type="checkbox" value="30">30
				<input type="checkbox" value="31">31 <input type="checkbox" value="32">32 <input type="checkbox" value="33">33
				<input type="checkbox" value="34">34 <input type="checkbox" value="35">35 <input type="checkbox" value="36">36
				<input type="checkbox" value="37">37 <input type="checkbox" value="38">38 <input type="checkbox" value="39">39
				<input type="checkbox" value="40">40
			</div>
			<div class="line secondList">
				<input type="checkbox" value="41">41 <input type="checkbox" value="42">42 <input type="checkbox" value="43">43
				<input type="checkbox" value="44">44 <input type="checkbox" value="45">45 <input type="checkbox" value="46">46
				<input type="checkbox" value="47">47 <input type="checkbox" value="48">48 <input type="checkbox" value="49">49
				<input type="checkbox" value="50">50
				<input type="checkbox" value="51">51 <input type="checkbox" value="52">52 <input type="checkbox" value="53">53
				<input type="checkbox" value="54">54 <input type="checkbox" value="55">55 <input type="checkbox" value="56">56
				<input type="checkbox" value="57">57 <input type="checkbox" value="58">58 <input type="checkbox" value="59">59
			</div>
		</div>
		<div tabid="tab-minute" title="分钟">
			<div class="line">
	            <input type="radio" checked="checked" name="min" onclick="everyTime(this)"><span>每分&nbsp;&nbsp;&nbsp;&nbsp;允许的通配符[, - * /]</span>
	        </div>
	        <div class="line">
	            <input type="radio" id="minCycle" name="min" onclick="cycle(this)"><span>周期&nbsp;&nbsp;&nbsp;&nbsp;从第</span>
	            <input value="1"id="minStart_0"> <span>-</span>
	            <input value="2" id="minEnd_0"><span>分钟，每分钟执行一次</span></div>
	        <div class="line">
	            <input type="radio" id="minStartOn" name="min" onclick="startOn(this)"><span>循环&nbsp;&nbsp;&nbsp;&nbsp;从第</span>
	            <input value="0" id="minStart_1"><span>分钟开始，每</span>
	            <input value="1" id="minEnd_1"><span>分钟执行一次</span></div>
	        <div class="line">
	            <input type="radio" name="min" id="min_appoint"><span>指定&nbsp;&nbsp;&nbsp;&nbsp;请勾选第几分钟</span></div>
	        <div class="line minList">
	            <input type="checkbox" value="1">01
	            <input type="checkbox" value="2">02
	            <input type="checkbox" value="3">03
	            <input type="checkbox" value="4">04
	            <input type="checkbox" value="5">05
	            <input type="checkbox" value="6">06
	            <input type="checkbox" value="7">07
	            <input type="checkbox" value="8">08
	            <input type="checkbox" value="9">09
	            <input type="checkbox" value="10">10
	            <input type="checkbox" value="11">11
	            <input type="checkbox" value="12">12
	            <input type="checkbox" value="13">13
	            <input type="checkbox" value="14">14
	            <input type="checkbox" value="15">15
	            <input type="checkbox" value="16">16
	            <input type="checkbox" value="17">17
	            <input type="checkbox" value="18">18
	            <input type="checkbox" value="19">19
	            <input type="checkbox" value="20">20</div>
	        <div class="line minList">
	            <input type="checkbox" value="21">21
	            <input type="checkbox" value="22">22
	            <input type="checkbox" value="23">23
	            <input type="checkbox" value="24">24
	            <input type="checkbox" value="25">25
	            <input type="checkbox" value="26">26
	            <input type="checkbox" value="27">27
	            <input type="checkbox" value="28">28
	            <input type="checkbox" value="29">29
	            <input type="checkbox" value="30">30
	            <input type="checkbox" value="31">31
	            <input type="checkbox" value="32">32
	            <input type="checkbox" value="33">33
	            <input type="checkbox" value="34">34
	            <input type="checkbox" value="35">35
	            <input type="checkbox" value="36">36
	            <input type="checkbox" value="37">37
	            <input type="checkbox" value="38">38
	            <input type="checkbox" value="39">39
	            <input type="checkbox" value="40">40</div>
	        <div class="line minList">
	            <input type="checkbox" value="41">41
	            <input type="checkbox" value="42">42
	            <input type="checkbox" value="43">43
	            <input type="checkbox" value="44">44
	            <input type="checkbox" value="45">45
	            <input type="checkbox" value="46">46
	            <input type="checkbox" value="47">47
	            <input type="checkbox" value="48">48
	            <input type="checkbox" value="49">49
	            <input type="checkbox" value="50">50
	            <input type="checkbox" value="51">51
	            <input type="checkbox" value="52">52
	            <input type="checkbox" value="53">53
	            <input type="checkbox" value="54">54
	            <input type="checkbox" value="55">55
	            <input type="checkbox" value="56">56
	            <input type="checkbox" value="57">57
	            <input type="checkbox" value="58">58
	            <input type="checkbox" value="59">59
	        </div>
		</div>
		<div tabid="tab-hour" title="小时">
			<div class="line">
				<input type="radio" checked="checked" name="hour" onclick="everyTime(this)"> <span>小时&nbsp;&nbsp;&nbsp;&nbsp;允许的通配符[, - * /]</span>
			</div>
			<div class="line">
				<input type="radio" id="hourCycle" name="hour" onclick="cycle(this)"> <span>周期&nbsp;&nbsp;&nbsp;&nbsp;从第</span>
				<input value="0" id="hourStart_0"> <span>- </span>
				<input value="2" id="hourEnd_0"> <span>小时，每小时执行一次</span>
			</div>
			<div class="line">
				<input type="radio" id="hourStartOn" name="hour" onclick="startOn(this)"> <span>循环&nbsp;&nbsp;&nbsp;&nbsp;从第</span>
				<input value="0" id="hourStart_1"><span>小时开始，每 </span>
				<input value="1" id="hourEnd_1"><span>小时执行一次</span>
			</div>
			<div class="line">
				<input type="radio" name="hour" id="hour_appoint"> <span>指定&nbsp;&nbsp;&nbsp;&nbsp;请勾选第几小时</span>
			</div>
			<div class="line hourList">
				AM: <input type="checkbox" value="0">00 <input type="checkbox" value="1">01 <input type="checkbox"
					value="2">02 <input type="checkbox" value="3">03 <input type="checkbox" value="4">04 <input type="checkbox"
					value="5">05 <input type="checkbox" value="6">06 <input type="checkbox" value="7">07 <input type="checkbox"
					value="8">08 <input type="checkbox" value="9">09 <input type="checkbox" value="10">10 <input type="checkbox" value="11">11
			</div>
			<div class="line hourList">
				PM: <input type="checkbox" value="12">12 <input type="checkbox" value="13">13 <input type="checkbox" value="14">14 <input type="checkbox" value="15">15
				<input type="checkbox" value="16">16 <input type="checkbox" value="17">17 <input type="checkbox" value="18">18
				<input type="checkbox" value="19">19 <input type="checkbox" value="20">20 <input type="checkbox" value="21">21
				<input type="checkbox" value="22">22 <input type="checkbox" value="23">23
			</div>
		</div>
		<div tabid="tab-day" title="日">
			<div class="line">
				<input type="radio" checked="checked" name="day" onclick="everyTime(this)"> <span>每日&nbsp;&nbsp;&nbsp;&nbsp;允许的通配符[, - * / L W]</span>
			</div>
			<div class="line">
				<input type="radio" name="day" onclick="unAppoint(this)"> <span>不指定</span>
			</div>
			<div class="line">
				<input type="radio" id="dayCycle" name="day" onclick="cycle(this)"> <span>周期&nbsp;&nbsp;&nbsp;&nbsp;从第 </span>
				<input value="1" id="dayStart_0"><span> - </span>
				<input value="2" id="dayEnd_0"> <span>日，每日执行一次</span>
			</div>
			<div class="line">
				<input type="radio" id="dayStartOn" name="day" onclick="startOn(this)"> <span>循环&nbsp;&nbsp;&nbsp;&nbsp;从第 </span>
				<input value="1" id="dayStart_1"><span> 日开始，每 </span>
				<input value="1" id="dayEnd_1"> <span>天执行一次</span>
			</div>
			<div class="line">
				<input type="radio" id="dayWorkDay" name="day" onclick="workDay(this)"><span> 每月 </span>
				<input data-options="min:1,max:31" value="1" id="dayStart_2"> <span>号最近的那个工作日</span>
			</div>
			<div class="line">
				<input type="radio" name="day" onclick="lastDay(this)"> <span>本月最后一天</span>
			</div>
			<div class="line">
				<input type="radio" name="day" id="day_appoint"> <span>指定&nbsp;&nbsp;&nbsp;&nbsp;请勾选第几日</span>
			</div>
			<div class="line dayList">
				<input type="checkbox" value="1">1 <input type="checkbox" value="2">2 <input type="checkbox" value="3">3 
				<input type="checkbox" value="4">4 <input type="checkbox" value="5">5 <input type="checkbox" value="6">6 
				<input type="checkbox" value="7">7 <input type="checkbox" value="8">8 <input type="checkbox" value="9">9 
				<input type="checkbox" value="10">10 <input type="checkbox" value="11">11 <input type="checkbox" value="12">12
				<input type="checkbox" value="13">13 <input type="checkbox" value="14">14 <input type="checkbox" value="15">15
				<input type="checkbox" value="16">16
			</div>
			<div class="line dayList">
				<input type="checkbox" value="17">17 <input type="checkbox" value="18">18 <input type="checkbox" value="19">19
				<input type="checkbox" value="20">20 <input type="checkbox" value="21">21 <input type="checkbox" value="22">22
				<input type="checkbox" value="23">23 <input type="checkbox" value="24">24 <input type="checkbox" value="25">25
				<input type="checkbox" value="26">26 <input type="checkbox" value="27">27 <input type="checkbox" value="28">28
				<input type="checkbox" value="29">29 <input type="checkbox" value="30">30 <input type="checkbox" value="31">31
			</div>
		</div>
		<div tabid="tab-month" title="月">
			<div class="line">
				<input type="radio" checked="checked" name="month" onclick="everyTime(this)"> <span>每月&nbsp;&nbsp;&nbsp;&nbsp;允许的通配符[, - * /]</span></div>
			<div class="line">
				<input type="radio" name="month" onclick="unAppoint(this)"><span>不指定</span>
			</div>
			<div class="line">
				<input type="radio"  id="monthCycle" name="month" onclick="cycle(this)"> <span>周期&nbsp;&nbsp;&nbsp;&nbsp;从第</span>
				<input value="1" id="monthStart_0"><span> -</span>
				<input value="2" id="monthEnd_0"> <span>月，每月执行一次</span>
			</div>
			<div class="line">
				<input type="radio" id="monthStartOn" name="month" onclick="startOn(this)"> <span>循环&nbsp;&nbsp;&nbsp;&nbsp;从第</span>
				<input value="1" id="monthStart_1"> <span>月开始，每</span> 
				<input value="1" id="monthEnd_1"> <span>月执行一次</span>
			</div>
			<div class="line">
				<input type="radio" name="month" id="month_appoint"> <span>指定</span>
			</div>
			<div class="line monthList">
				<input type="checkbox" value="1">1 <input type="checkbox" value="2">2 <input type="checkbox" value="3">3 
				<input type="checkbox" value="4">4 <input type="checkbox" value="5">5 <input type="checkbox" value="6">6 
				<input type="checkbox" value="7">7 <input type="checkbox" value="8">8 <input type="checkbox" value="9">9 
				<input type="checkbox" value="10">10 <input type="checkbox" value="11">11 <input type="checkbox" value="12">12
			</div>
		</div>
		<div tabid="tab-week" title="周">
			<div class="line">
				<input type="radio" checked="checked" name="week" onclick="everyTime(this)"> <span>每周&nbsp;&nbsp;&nbsp;&nbsp;允许的通配符[, - * / L #]</span>
			</div>
			<div class="line">
				<input type="radio" name="week" onclick="unAppoint(this)"> <span>不指定</span>
			</div>
			<div class="line">
				<input type="radio" id="weekStartOn" name="week" onclick="startOn(this)" > 
				<span>周期&nbsp;&nbsp;&nbsp;&nbsp;从星期</span>
				<input id="weekStart_0" value="1">
				<span>-</span> 
				<input value="2" id="weekEnd_0"><span>每天执行</span>
			</div>
			<div class="line">
				<input type="radio" id="wweekOfDay" name="week" onclick="weekOfDay(this)"> <span>循环&nbsp;&nbsp;&nbsp;&nbsp;从第</span>
				<input value="1" id="weekStart_1"> <span>周的星期</span>
				<input id="weekEnd_1" value="1">
			</div>
			<div class="line">
				<input type="radio" id="weekLastWeek" name="week" onclick="lastWeek(this)"> <span>单个&nbsp;&nbsp;&nbsp;&nbsp;本月最后一个星期</span>
				<input id="weekStart_2" value="1">
			</div>
			<div class="line">
				<input type="radio" name="week" id="week_appoint"> <span>指定</span>
			</div>
			<div class="line weekList">
				<input type="checkbox" value="1">星期天 &nbsp;&nbsp;<input type="checkbox" value="2">星期一 &nbsp;&nbsp;<input type="checkbox" value="3">星期二 &nbsp;&nbsp;<input type="checkbox" value="4">星期三 &nbsp;&nbsp;
			</div>
			<div class="line weekList">
				<input type="checkbox" value="5">星期四 &nbsp;&nbsp;<input type="checkbox" value="6">星期五 &nbsp;&nbsp;<input type="checkbox" value="7">星期六 &nbsp;&nbsp;
			</div>
		</div>
		<div tabid="tab-year" title="年">
			<div class="line">
				<input type="radio" checked="checked" name="year" onclick="unAppoint(this)"> <span>不指定 &nbsp;&nbsp;&nbsp;&nbsp;允许的通配符[, - * /] 非必填</span>
			</div>
			<div class="line">
				<input type="radio" name="year" onclick="everyTime(this)"> <span>每年</span>
			</div>
			<div class="line">
				<input type="radio" id="yearCycle" name="year" onclick="cycle(this)"><span>周期&nbsp;&nbsp;&nbsp;&nbsp;从第</span> 
				<input id="yearStart_0" value="2015"><span>- </span><input id="yearEnd_0" value="2016"><span>年，每年执行</span>
			</div>
		</div>
	</div>
</div>


