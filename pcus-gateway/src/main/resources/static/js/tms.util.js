/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Create a cookie with the given name and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', {expires: 7, path: '/', domain: 'jquery.com', secure: true});
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value.
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given name.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String name The name of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};/*!
 * jQuery Form Plugin
 * version: 2.96 (16-FEB-2012)
 * @requires jQuery v1.3.2 or later
 *
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Dual licensed under the MIT and GPL licenses:
 *	http://www.opensource.org/licenses/mit-license.php
 *	http://www.gnu.org/licenses/gpl.html
 */
;(function($) {

/*
	Usage Note:
	-----------
	Do not use both ajaxSubmit and ajaxForm on the same form.  These
	functions are mutually exclusive.  Use ajaxSubmit if you want
	to bind your own submit handler to the form.  For example,

	$(document).ready(function() {
		$('#myForm').bind('submit', function(e) {
			e.preventDefault(); // <-- important
			$(this).ajaxSubmit({
				target: '#output'
			});
		});
	});

	Use ajaxForm when you want the plugin to manage all the event binding
	for you.  For example,

	$(document).ready(function() {
		$('#myForm').ajaxForm({
			target: '#output'
		});
	});
	
	You can also use ajaxForm with delegation (requires jQuery v1.7+), so the
	form does not have to exist when you invoke ajaxForm:

	$('#myForm').ajaxForm({
		delegation: true,
		target: '#output'
	});
	
	When using ajaxForm, the ajaxSubmit function will be invoked for you
	at the appropriate time.
*/

/**
 * ajaxSubmit() provides a mechanism for immediately submitting
 * an HTML form using AJAX.
 */
$.fn.ajaxSubmit = function(options) {
	// fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
	if (!this.length) {
		log('ajaxSubmit: skipping submit process - no element selected');
		return this;
	}
	
	var method, action, url, $form = this;

	if (typeof options == 'function') {
		options = { success: options };
	}

	method = this.attr('method');
	action = this.attr('action');
	url = (typeof action === 'string') ? $.trim(action) : '';
	url = url || window.location.href || '';
	if (url) {
		// clean url (don't include hash vaue)
		url = (url.match(/^([^#]+)/)||[])[1];
	}

	options = $.extend(true, {
		url:  url,
		success: $.ajaxSettings.success,
		type: method || 'GET',
		iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'
	}, options);

	// hook for manipulating the form data before it is extracted;
	// convenient for use with rich editors like tinyMCE or FCKEditor
	var veto = {};
	this.trigger('form-pre-serialize', [this, options, veto]);
	if (veto.veto) {
		log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
		return this;
	}

	// provide opportunity to alter form data before it is serialized
	if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
		log('ajaxSubmit: submit aborted via beforeSerialize callback');
		return this;
	}

	var traditional = options.traditional;
	if ( traditional === undefined ) {
		traditional = $.ajaxSettings.traditional;
	}
	
	var qx,n,v,a = this.formToArray(options.semantic); 
	if (options.data) {
		options.extraData = options.data;
		qx = $.param(options.data, traditional);
	}

	// give pre-submit callback an opportunity to abort the submit
	if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
		log('ajaxSubmit: submit aborted via beforeSubmit callback');
		return this;
	}

	// fire vetoable 'validate' event
	this.trigger('form-submit-validate', [a, this, options, veto]);
	if (veto.veto) {
		log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
		return this;
	}

	var q = $.param(a, traditional);
	if (qx) {
		q = ( q ? (q + '&' + qx) : qx );
	}	
	if (options.type.toUpperCase() == 'GET') {
		options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
		options.data = null;  // data is null for 'get'
	}
	else {
		options.data = q; // data is the query string for 'post'
	}

	var callbacks = [];
	if (options.resetForm) {
		callbacks.push(function() { $form.resetForm(); });
	}
	if (options.clearForm) {
		callbacks.push(function() { $form.clearForm(options.includeHidden); });
	}

	// perform a load on the target only if dataType is not provided
	if (!options.dataType && options.target) {
		var oldSuccess = options.success || function(){};
		callbacks.push(function(data) {
			var fn = options.replaceTarget ? 'replaceWith' : 'html';
			$(options.target)[fn](data).each(oldSuccess, arguments);
		});
	}
	else if (options.success) {
		callbacks.push(options.success);
	}

	options.success = function(data, status, xhr) { // jQuery 1.4+ passes xhr as 3rd arg
		var context = options.context || options;	// jQuery 1.4+ supports scope context 
		for (var i=0, max=callbacks.length; i < max; i++) {
			callbacks[i].apply(context, [data, status, xhr || $form, $form]);
		}
	};

	// are there files to upload?
	var fileInputs = $('input:file:enabled[value]', this); // [value] (issue #113)
	var hasFileInputs = fileInputs.length > 0;
	var mp = 'multipart/form-data';
	var multipart = ($form.attr('enctype') == mp || $form.attr('encoding') == mp);

	var fileAPI = !!(hasFileInputs && fileInputs.get(0).files && window.FormData);
	log("fileAPI :" + fileAPI);
	var shouldUseFrame = (hasFileInputs || multipart) && !fileAPI;

	// options.iframe allows user to force iframe mode
	// 06-NOV-09: now defaulting to iframe mode if file input is detected
	if (options.iframe !== false && (options.iframe || shouldUseFrame)) {
		// hack to fix Safari hang (thanks to Tim Molendijk for this)
		// see:  http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
		if (options.closeKeepAlive) {
			$.get(options.closeKeepAlive, function() {
				fileUploadIframe(a);
			});
		}
  		else {
			fileUploadIframe(a);
  		}
	}
	else if ((hasFileInputs || multipart) && fileAPI) {
		options.progress = options.progress || $.noop;
		fileUploadXhr(a);
	}
	else {
		$.ajax(options);
	}

	 // fire 'notify' event
	 this.trigger('form-submit-notify', [this, options]);
	 return this;

	 // XMLHttpRequest Level 2 file uploads (big hat tip to francois2metz)
	function fileUploadXhr(a) {
		var formdata = new FormData();

		for (var i=0; i < a.length; i++) {
			if (a[i].type == 'file')
				continue;
			formdata.append(a[i].name, a[i].value);
		}

		$form.find('input:file:enabled').each(function(){
			var name = $(this).attr('name'), files = this.files;
			if (name) {
				for (var i=0; i < files.length; i++)
					formdata.append(name, files[i]);
			}
		});

		if (options.extraData) {
			for (var k in options.extraData)
				formdata.append(k, options.extraData[k])
		}

		options.data = null;

		var s = $.extend(true, {}, $.ajaxSettings, options, {
			contentType: false,
			processData: false,
			cache: false,
			type: 'POST'
		});

      //s.context = s.context || s;

      s.data = null;
      var beforeSend = s.beforeSend;
      s.beforeSend = function(xhr, o) {
          o.data = formdata;
          if(xhr.upload) { // unfortunately, jQuery doesn't expose this prop (http://bugs.jquery.com/ticket/10190)
              xhr.upload.onprogress = function(event) {
                  o.progress(event.position, event.total);
              };
          }
          if(beforeSend)
              beforeSend.call(o, xhr, options);
      };
      $.ajax(s);
   }

	// private function for handling file uploads (hat tip to YAHOO!)
	function fileUploadIframe(a) {
		var form = $form[0], el, i, s, g, id, $io, io, xhr, sub, n, timedOut, timeoutHandle;
		var useProp = !!$.fn.prop;

		if (a) {
			if ( useProp ) {
				// ensure that every serialized input is still enabled
				for (i=0; i < a.length; i++) {
					el = $(form[a[i].name]);
					el.prop('disabled', false);
				}
			} else {
				for (i=0; i < a.length; i++) {
					el = $(form[a[i].name]);
					el.removeAttr('disabled');
				}
			};
		}

		if ($(':input[name=submit],:input[id=submit]', form).length) {
			// if there is an input with a name or id of 'submit' then we won't be
			// able to invoke the submit fn on the form (at least not x-browser)
			alert('Error: Form elements must not have name or id of "submit".');
			return;
		}
		
		s = $.extend(true, {}, $.ajaxSettings, options);
		s.context = s.context || s;
		id = 'jqFormIO' + (new Date().getTime());
		if (s.iframeTarget) {
			$io = $(s.iframeTarget);
			n = $io.attr('name');
			if (n == null)
			 	$io.attr('name', id);
			else
				id = n;
		}
		else {
			$io = $('<iframe name="' + id + '" src="'+ s.iframeSrc +'" />');
			$io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
		}
		io = $io[0];


		xhr = { // mock object
			aborted: 0,
			responseText: null,
			responseXML: null,
			status: 0,
			statusText: 'n/a',
			getAllResponseHeaders: function() {},
			getResponseHeader: function() {},
			setRequestHeader: function() {},
			abort: function(status) {
				var e = (status === 'timeout' ? 'timeout' : 'aborted');
				log('aborting upload... ' + e);
				this.aborted = 1;
				$io.attr('src', s.iframeSrc); // abort op in progress
				xhr.error = e;
				s.error && s.error.call(s.context, xhr, e, status);
				g && $.event.trigger("ajaxError", [xhr, s, e]);
				s.complete && s.complete.call(s.context, xhr, e);
			}
		};

		g = s.global;
		// trigger ajax global events so that activity/block indicators work like normal
		if (g && ! $.active++) {
			$.event.trigger("ajaxStart");
		}
		if (g) {
			$.event.trigger("ajaxSend", [xhr, s]);
		}

		if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
			if (s.global) {
				$.active--;
			}
			return;
		}
		if (xhr.aborted) {
			return;
		}

		// add submitting element to data if we know it
		sub = form.clk;
		if (sub) {
			n = sub.name;
			if (n && !sub.disabled) {
				s.extraData = s.extraData || {};
				s.extraData[n] = sub.value;
				if (sub.type == "image") {
					s.extraData[n+'.x'] = form.clk_x;
					s.extraData[n+'.y'] = form.clk_y;
				}
			}
		}
		
		var CLIENT_TIMEOUT_ABORT = 1;
		var SERVER_ABORT = 2;

		function getDoc(frame) {
			var doc = frame.contentWindow ? frame.contentWindow.document : frame.contentDocument ? frame.contentDocument : frame.document;
			return doc;
		}
		
		// Rails CSRF hack (thanks to Yvan Barthelemy)
		var csrf_token = $('meta[name=csrf-token]').attr('content');
		var csrf_param = $('meta[name=csrf-param]').attr('content');
		if (csrf_param && csrf_token) {
			s.extraData = s.extraData || {};
			s.extraData[csrf_param] = csrf_token;
		}

		// take a breath so that pending repaints get some cpu time before the upload starts
		function doSubmit() {
			// make sure form attrs are set
			var t = $form.attr('target'), a = $form.attr('action');

			// update form attrs in IE friendly way
			form.setAttribute('target',id);
			if (!method) {
				form.setAttribute('method', 'POST');
			}
			if (a != s.url) {
				form.setAttribute('action', s.url);
			}

			// ie borks in some cases when setting encoding
			if (! s.skipEncodingOverride && (!method || /post/i.test(method))) {
				$form.attr({
					encoding: 'multipart/form-data',
					enctype:  'multipart/form-data'
				});
			}

			// support timout
			if (s.timeout) {
				timeoutHandle = setTimeout(function() { timedOut = true; cb(CLIENT_TIMEOUT_ABORT); }, s.timeout);
			}
			
			// look for server aborts
			function checkState() {
				try {
					var state = getDoc(io).readyState;
					log('state = ' + state);
					if (state.toLowerCase() == 'uninitialized')
						setTimeout(checkState,50);
				}
				catch(e) {
					console.error(e);
					log('Server abort: ' , e, ' (', e.name, ')');
					cb(SERVER_ABORT);
					timeoutHandle && clearTimeout(timeoutHandle);
					timeoutHandle = undefined;
				}
			}

			// add "extra" data to form if provided in options
			var extraInputs = [];
			try {
				if (s.extraData) {
					for (var n in s.extraData) {
						extraInputs.push(
							$('<input type="hidden" name="'+n+'">').attr('value',s.extraData[n])
								.appendTo(form)[0]);
					}
				}

				if (!s.iframeTarget) {
					// add iframe to doc and submit the form
					$io.appendTo('body');
					io.attachEvent ? io.attachEvent('onload', cb) : io.addEventListener('load', cb, false);
				}
				setTimeout(checkState,15);
				form.submit();
			}
            catch (e) {
				console.error(e);
			}
			finally {
				// reset attrs and remove "extra" input elements
				form.setAttribute('action',a);
				if(t) {
					form.setAttribute('target', t);
				} else {
					$form.removeAttr('target');
				}
				$(extraInputs).remove();
			}
		}

		if (s.forceSync) {
			doSubmit();
		}
		else {
			setTimeout(doSubmit, 10); // this lets dom updates render
		}

		var data, doc, domCheckCount = 50, callbackProcessed;

		function cb(e) {
			if (xhr.aborted || callbackProcessed) {
				return;
			}
			try {
				doc = getDoc(io);
			}
			catch(ex) {
				console.error(e);
				log('cannot access response document: ', ex);
				e = SERVER_ABORT;
			}
			if (e === CLIENT_TIMEOUT_ABORT && xhr) {
				xhr.abort('timeout');
				return;
			}
			else if (e == SERVER_ABORT && xhr) {
				xhr.abort('server abort');
				return;
			}

			if (!doc || doc.location.href == s.iframeSrc) {
				// response not received yet
				if (!timedOut)
					return;
			}
			io.detachEvent ? io.detachEvent('onload', cb) : io.removeEventListener('load', cb, false);

			var status = 'success', errMsg;
			try {
				if (timedOut) {
					throw 'timeout';
				}

				var isXml = s.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
				log('isXml='+isXml);
				if (!isXml && window.opera && (doc.body == null || doc.body.innerHTML == '')) {
					if (--domCheckCount) {
						// in some browsers (Opera) the iframe DOM is not always traversable when
						// the onload callback fires, so we loop a bit to accommodate
						log('requeing onLoad callback, DOM not available');
						setTimeout(cb, 250);
						return;
					}
					// let this fall through because server response could be an empty document
					//log('Could not access iframe DOM after mutiple tries.');
					//throw 'DOMException: not available';
				}

				//log('response detected');
				var docRoot = doc.body ? doc.body : doc.documentElement;
				xhr.responseText = docRoot ? docRoot.innerHTML : null;
				xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
				if (isXml)
					s.dataType = 'xml';
				xhr.getResponseHeader = function(header){
					var headers = {'content-type': s.dataType};
					return headers[header];
				};
				// support for XHR 'status' & 'statusText' emulation :
				if (docRoot) {
					xhr.status = Number( docRoot.getAttribute('status') ) || xhr.status;
					xhr.statusText = docRoot.getAttribute('statusText') || xhr.statusText;
				}

				var dt = (s.dataType || '').toLowerCase();
				var scr = /(json|script|text)/.test(dt);
				if (scr || s.textarea) {
					// see if user embedded response in textarea
					var ta = doc.getElementsByTagName('textarea')[0];
					if (ta) {
						xhr.responseText = ta.value;
						// support for XHR 'status' & 'statusText' emulation :
						xhr.status = Number( ta.getAttribute('status') ) || xhr.status;
						xhr.statusText = ta.getAttribute('statusText') || xhr.statusText;
					}
					else if (scr) {
						// account for browsers injecting pre around json response
						var pre = doc.getElementsByTagName('pre')[0];
						var b = doc.getElementsByTagName('body')[0];
						if (pre) {
							xhr.responseText = pre.textContent ? pre.textContent : pre.innerText;
						}
						else if (b) {
							xhr.responseText = b.textContent ? b.textContent : b.innerText;
						}
					}
				}
				else if (dt == 'xml' && !xhr.responseXML && xhr.responseText != null) {
					xhr.responseXML = toXml(xhr.responseText);
				}

				try {
					data = httpData(xhr, dt, s);
				}
				catch (e) {
                    console.error(e);
					status = 'parsererror';
					xhr.error = errMsg = (e || status);
				}
			}
			catch (e) {
                console.error(e);
				log('error caught: ',e);
				status = 'error';
				xhr.error = errMsg = (e || status);
			}

			if (xhr.aborted) {
				log('upload aborted');
				status = null;
			}

			if (xhr.status) { // we've set xhr.status
				status = (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) ? 'success' : 'error';
			}

			// ordering of these callbacks/triggers is odd, but that's how $.ajax does it
			if (status === 'success') {
				s.success && s.success.call(s.context, data, 'success', xhr);
				g && $.event.trigger("ajaxSuccess", [xhr, s]);
			}
			else if (status) {
				if (errMsg == undefined)
					errMsg = xhr.statusText;
				s.error && s.error.call(s.context, xhr, status, errMsg);
				g && $.event.trigger("ajaxError", [xhr, s, errMsg]);
			}

			g && $.event.trigger("ajaxComplete", [xhr, s]);

			if (g && ! --$.active) {
				$.event.trigger("ajaxStop");
			}

			s.complete && s.complete.call(s.context, xhr, status);

			callbackProcessed = true;
			if (s.timeout)
				clearTimeout(timeoutHandle);

			// clean up
			setTimeout(function() {
				if (!s.iframeTarget)
					$io.remove();
				xhr.responseXML = null;
			}, 100);
		}

		var toXml = $.parseXML || function(s, doc) { // use parseXML if available (jQuery 1.5+)
			if (window.ActiveXObject) {
				doc = new ActiveXObject('Microsoft.XMLDOM');
				doc.async = 'false';
				doc.loadXML(s);
			}
			else {
				doc = (new DOMParser()).parseFromString(s, 'text/xml');
			}
			return (doc && doc.documentElement && doc.documentElement.nodeName != 'parsererror') ? doc : null;
		};
		var parseJSON = $.parseJSON || function(s) {
			return window['eval']('(' + s + ')');
		};

		var httpData = function( xhr, type, s ) { // mostly lifted from jq1.4.4

			var ct = xhr.getResponseHeader('content-type') || '',
				xml = type === 'xml' || !type && ct.indexOf('xml') >= 0,
				data = xml ? xhr.responseXML : xhr.responseText;

			if (xml && data.documentElement.nodeName === 'parsererror') {
				$.error && $.error('parsererror');
			}
			if (s && s.dataFilter) {
				data = s.dataFilter(data, type);
			}
			if (typeof data === 'string') {
				if (type === 'json' || !type && ct.indexOf('json') >= 0) {
					data = parseJSON(data);
				} else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
					$.globalEval(data);
				}
			}
			return data;
		};
	}
};

/**
 * ajaxForm() provides a mechanism for fully automating form submission.
 *
 * The advantages of using this method instead of ajaxSubmit() are:
 *
 * 1: This method will include coordinates for <input type="image" /> elements (if the element
 *	is used to submit the form).
 * 2. This method will include the submit element's name/value data (for the element that was
 *	used to submit the form).
 * 3. This method binds the submit() method to the form for you.
 *
 * The options argument for ajaxForm works exactly as it does for ajaxSubmit.  ajaxForm merely
 * passes the options argument along after properly binding events for submit elements and
 * the form itself.
 */
$.fn.ajaxForm = function(options) {
	options = options || {};
	options.delegation = options.delegation && $.isFunction($.fn.on);
	
	// in jQuery 1.3+ we can fix mistakes with the ready state
	if (!options.delegation && this.length === 0) {
		var o = { s: this.selector, c: this.context };
		if (!$.isReady && o.s) {
			log('DOM not ready, queuing ajaxForm');
			$(function() {
				$(o.s,o.c).ajaxForm(options);
			});
			return this;
		}
		// is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
		log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
		return this;
	}

	if ( options.delegation ) {
		$(document)
			.off('submit.form-plugin', this.selector, doAjaxSubmit)
			.off('click.form-plugin', this.selector, captureSubmittingElement)
			.on('submit.form-plugin', this.selector, options, doAjaxSubmit)
			.on('click.form-plugin', this.selector, options, captureSubmittingElement);
		return this;
	}

	return this.ajaxFormUnbind().on('submit.form-plugin', options, doAjaxSubmit).on('click.form-plugin', options, captureSubmittingElement);
};

// private event handlers	
function doAjaxSubmit(e) {
	var options = e.data;
	if (!e.isDefaultPrevented()) { // if event has been canceled, don't proceed
		e.preventDefault();
		$(this).ajaxSubmit(options);
	}
}
	
function captureSubmittingElement(e) {
	var target = e.target;
	var $el = $(target);
	if (!($el.is(":submit,input:image"))) {
		// is this a child element of the submit el?  (ex: a span within a button)
		var t = $el.closest(':submit');
		if (t.length == 0) {
			return;
		}
		target = t[0];
	}
	var form = this;
	form.clk = target;
	if (target.type == 'image') {
		if (e.offsetX != undefined) {
			form.clk_x = e.offsetX;
			form.clk_y = e.offsetY;
		} else if (typeof $.fn.offset == 'function') {
			var offset = $el.offset();
			form.clk_x = e.pageX - offset.left;
			form.clk_y = e.pageY - offset.top;
		} else {
			form.clk_x = e.pageX - target.offsetLeft;
			form.clk_y = e.pageY - target.offsetTop;
		}
	}
	// clear form vars
	setTimeout(function() { form.clk = form.clk_x = form.clk_y = null; }, 100);
};


// ajaxFormUnbind unbinds the event handlers that were bound by ajaxForm
$.fn.ajaxFormUnbind = function() {
	return this.unbind('submit.form-plugin click.form-plugin');
};

/**
 * formToArray() gathers form element data into an array of objects that can
 * be passed to any of the following ajax functions: $.get, $.post, or load.
 * Each object in the array has both a 'name' and 'value' property.  An example of
 * an array for a simple login form might be:
 *
 * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
 *
 * It is this array that is passed to pre-submit callback functions provided to the
 * ajaxSubmit() and ajaxForm() methods.
 */
$.fn.formToArray = function(semantic) {
	var a = [];
	if (this.length === 0) {
		return a;
	}

	var form = this[0];
	var els = semantic ? form.getElementsByTagName('*') : form.elements;
	if (!els) {
		return a;
	}

	var i,j,n,v,el,max,jmax;
	for(i=0, max=els.length; i < max; i++) {
		el = els[i];
		n = el.name;
		if (!n) {
			continue;
		}

		if (semantic && form.clk && el.type == "image") {
			// handle image inputs on the fly when semantic == true
			if(!el.disabled && form.clk == el) {
				a.push({name: n, value: $(el).val(), type: el.type });
				a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
			}
			continue;
		}

		v = $.fieldValue(el, true);
		if (v && v.constructor == Array) {
			for(j=0, jmax=v.length; j < jmax; j++) {
				a.push({name: n, value: v[j]});
			}
		}
		else if (v !== null && typeof v != 'undefined') {
			a.push({name: n, value: v, type: el.type});
		}
	}

	if (!semantic && form.clk) {
		// input type=='image' are not found in elements array! handle it here
		var $input = $(form.clk), input = $input[0];
		n = input.name;
		if (n && !input.disabled && input.type == 'image') {
			a.push({name: n, value: $input.val()});
			a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
		}
	}
	return a;
};

/**
 * Serializes form data into a 'submittable' string. This method will return a string
 * in the format: name1=value1&amp;name2=value2
 */
$.fn.formSerialize = function(semantic) {
	//hand off to jQuery.param for proper encoding
	return $.param(this.formToArray(semantic));
};

/**
 * Serializes all field elements in the jQuery object into a query string.
 * This method will return a string in the format: name1=value1&amp;name2=value2
 */
$.fn.fieldSerialize = function(successful) {
	var a = [];
	this.each(function() {
		var n = this.name;
		if (!n) {
			return;
		}
		var v = $.fieldValue(this, successful);
		if (v && v.constructor == Array) {
			for (var i=0,max=v.length; i < max; i++) {
				a.push({name: n, value: v[i]});
			}
		}
		else if (v !== null && typeof v != 'undefined') {
			a.push({name: this.name, value: v});
		}
	});
	//hand off to jQuery.param for proper encoding
	return $.param(a);
};

/**
 * Returns the value(s) of the element in the matched set.  For example, consider the following form:
 *
 *  <form><fieldset>
 *	  <input name="A" type="text" />
 *	  <input name="A" type="text" />
 *	  <input name="B" type="checkbox" value="B1" />
 *	  <input name="B" type="checkbox" value="B2"/>
 *	  <input name="C" type="radio" value="C1" />
 *	  <input name="C" type="radio" value="C2" />
 *  </fieldset></form>
 *
 *  var v = $(':text').fieldValue();
 *  // if no values are entered into the text inputs
 *  v == ['','']
 *  // if values entered into the text inputs are 'foo' and 'bar'
 *  v == ['foo','bar']
 *
 *  var v = $(':checkbox').fieldValue();
 *  // if neither checkbox is checked
 *  v === undefined
 *  // if both checkboxes are checked
 *  v == ['B1', 'B2']
 *
 *  var v = $(':radio').fieldValue();
 *  // if neither radio is checked
 *  v === undefined
 *  // if first radio is checked
 *  v == ['C1']
 *
 * The successful argument controls whether or not the field element must be 'successful'
 * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
 * The default value of the successful argument is true.  If this value is false the value(s)
 * for each element is returned.
 *
 * Note: This method *always* returns an array.  If no valid value can be determined the
 *	array will be empty, otherwise it will contain one or more values.
 */
$.fn.fieldValue = function(successful) {
	for (var val=[], i=0, max=this.length; i < max; i++) {
		var el = this[i];
		var v = $.fieldValue(el, successful);
		if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length)) {
			continue;
		}
		v.constructor == Array ? $.merge(val, v) : val.push(v);
	}
	return val;
};

/**
 * Returns the value of the field element.
 */
$.fieldValue = function(el, successful) {
	var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
	if (successful === undefined) {
		successful = true;
	}

	if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
		(t == 'checkbox' || t == 'radio') && !el.checked ||
		(t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
		tag == 'select' && el.selectedIndex == -1)) {
			return null;
	}

	if (tag == 'select') {
		var index = el.selectedIndex;
		if (index < 0) {
			return null;
		}
		var a = [], ops = el.options;
		var one = (t == 'select-one');
		var max = (one ? index+1 : ops.length);
		for(var i=(one ? index : 0); i < max; i++) {
			var op = ops[i];
			if (op.selected) {
				var v = op.value;
				if (!v) { // extra pain for IE...
					v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;
				}
				if (one) {
					return v;
				}
				a.push(v);
			}
		}
		return a;
	}
	return $(el).val();
};

/**
 * Clears the form data.  Takes the following actions on the form's input fields:
 *  - input text fields will have their 'value' property set to the empty string
 *  - select elements will have their 'selectedIndex' property set to -1
 *  - checkbox and radio inputs will have their 'checked' property set to false
 *  - inputs of type submit, button, reset, and hidden will *not* be effected
 *  - button elements will *not* be effected
 */
$.fn.clearForm = function(includeHidden) {
	return this.each(function() {
		$('input,select,textarea', this).clearFields(includeHidden);
	});
};

/**
 * Clears the selected form elements.
 */
$.fn.clearFields = $.fn.clearInputs = function(includeHidden) {
	var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i; // 'hidden' is not in this list
	return this.each(function() {
		var t = this.type, tag = this.tagName.toLowerCase();
		if (re.test(t) || tag == 'textarea' || (includeHidden && /hidden/.test(t)) ) {
			this.value = '';
		}
		else if (t == 'checkbox' || t == 'radio') {
			this.checked = false;
		}
		else if (tag == 'select') {
			this.selectedIndex = -1;
		}
	});
};

/**
 * Resets the form data.  Causes all form elements to be reset to their original value.
 */
$.fn.resetForm = function() {
	return this.each(function() {
		// guard against an input with the name of 'reset'
		// note that IE reports the reset function as an 'object'
		if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType)) {
			this.reset();
		}
	});
};

/**
 * Enables or disables any matching elements.
 */
$.fn.enable = function(b) {
	if (b === undefined) {
		b = true;
	}
	return this.each(function() {
		this.disabled = !b;
	});
};

/**
 * Checks/unchecks any matching checkboxes or radio buttons and
 * selects/deselects and matching option elements.
 */
$.fn.selected = function(select) {
	if (select === undefined) {
		select = true;
	}
	return this.each(function() {
		var t = this.type;
		if (t == 'checkbox' || t == 'radio') {
			this.checked = select;
		}
		else if (this.tagName.toLowerCase() == 'option') {
			var $sel = $(this).parent('select');
			if (select && $sel[0] && $sel[0].type == 'select-one') {
				// deselect all other options
				$sel.find('option').selected(false);
			}
			this.selected = select;
		}
	});
};

// expose debug var
$.fn.ajaxSubmit.debug = false;

// helper fn for console logging
function log() {
	if (!$.fn.ajaxSubmit.debug) 
		return;
	var msg = '[jquery.form] ' + Array.prototype.join.call(arguments,'');
	if (window.console && window.console.log) {
		window.console.log(msg);
	}
	else if (window.opera && window.opera.postError) {
		window.opera.postError(msg);
	}
};

})(jQuery);
/*
    http://www.JSON.org/json2.js
    2010-11-17

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON2)
{
    this.JSON = this.JSON2 = {};
}

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }

    function str(key, holder) {
        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];
        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
        case 'string':
            return quote(value);
        case 'number':
            return isFinite(value) ? String(value) : 'null';
        case 'boolean':
        case 'null':
            return String(value);
        case 'object':
            if (!value) {
                return 'null';
            }
            gap += indent;
            partial = [];
            if (Object.prototype.toString.apply(value) === '[object Array]') {
                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }
                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }
            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {
                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }
            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }
    if (typeof JSON2.stringify !== 'function') {
        JSON2.stringify = function (value, replacer, space) {
            var i;
            gap = '';
            indent = '';
            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }
            } else if (typeof space === 'string') {
                indent = space;
            }
            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON2.stringify');
            }
            return str('', {'': value});
        };
    }
    if (typeof JSON2.parse !== 'function') {
        JSON2.parse = function (text, reviver) {
            var j;
            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/
.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + text + ')');
                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }
            throw new SyntaxError('JSON2.parse');
        };
    }
}());
(function ($) {
    $.validator.addMethod(
            "notnull",
            function (value, element)
            {
                if (!value) return true;
                return !$(element).hasClass("l-text-field-null");
            },
            "不能为空"
    );

    //字母数字
    jQuery.validator.addMethod("alnum", function (value, element)
    {
        return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
    }, "只能包括英文字母和数字");

    // 手机号码验证   
    jQuery.validator.addMethod("cellphone", function (value, element)
    {
        var length = value.length;
        return this.optional(element) || (length == 11 && /^(1\d{10})$/.test(value));
    }, "请正确填写手机号码");

    // 电话号码验证   
    jQuery.validator.addMethod("telephone", function (value, element)
    {
        var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
        return this.optional(element) || (tel.test(value));
    }, "请正确填写电话号码");

    // 邮政编码验证
    jQuery.validator.addMethod("zipcode", function (value, element)
    {
        var tel = /^[0-9]{6}$/;
        return this.optional(element) || (tel.test(value));
    }, "请正确填写邮政编码");

    // 汉字
    jQuery.validator.addMethod("chcharacter", function (value, element)
    {
        var tel = /^[\u4e00-\u9fa5]+$/;
        return this.optional(element) || (tel.test(value));
    }, "请输入汉字");



    // QQ
    jQuery.validator.addMethod("qq", function (value, element)
    {
        var tel = /^[1-9][0-9]{4,}$/;
        return this.optional(element) || (tel.test(value));
    }, "请输入正确的QQ");

    // 用户名
    jQuery.validator.addMethod("username", function (value, element)
    {
        return this.optional(element) || /^[a-zA-Z][a-zA-Z0-9_]+$/.test(value);
    }, "用户名格式不正确");

    //小数点后不能超过2位
    jQuery.validator.addMethod("isTwoPrecision", function (value, element, param) {
        //声明返回值
        var returnValue = true;

        if (!param) return true;
        value = value.toString();
        //如果是小数
        var reg1 = /^[+-]?[1-9]?[0-9]*\.[0-9]*$/;
        if (reg1.test(value) == true) {
            if (value.indexOf(".") != -1) {
                if (value.substring(value.indexOf(".") + 1, value.length).length > 2) {
                    returnValue = false
                }
            }
        }
        return returnValue;
    }, "小数点后不能超过2位");

    jQuery.validator.addMethod("textRequired", function (value, element, param) {
        //声明返回值
        if (!value) return true;
    }, "文本框不能为空");

    jQuery.validator.addMethod("containerCode", function (value, element, param) {
        if (value) {
            return cntrUtil.verifyContainerCode(value);
        }
        return true;
    }, "集装箱号不正确");

    
})(jQuery);﻿/*  作者：       ZPHIT_COM
 *  创建时间：   2012/7/19 16:23:54
 *
 */
if (!this.LG) {
    this.LG = {};
}
(function ($) {

    LG.render = (function() {
        return {
            /**
             *
             * @param name
             */
            boolean: function (name) {
                return function (item) {
                    return true == item[name] ? '是' : '否';
                }
            },
            /**
             * 获取参照名称
             * @param data
             * @param idField
             * @param textField
             */
            ref: function (data, name, idField, textField, style) {
                //默认取值
                idField = (idField || 'id');
                textField = (textField || 'text');

                return function (param) {
                    // 用原生（ES2015） 替换了 JQ 方法
                    if (!data || data.length == 0) return param[name];

                    var targets = data.filter(function (item) {
                        return item[idField] == param[name];
                    });

                    var text = targets.length > 0 ? targets[0][textField] : '';

                    return (style && typeof style === 'function') ? style(text, param) : text;
                }
            },
            multiValue: function (dataArray, seperator) {
                var array = $.grep(dataArray, function(v) {
                    return !!v;
                });

                return array.join(seperator);
            }
            
        }
    })();

    LG.cookies = (function () {
        var fn = function () {
        };
        fn.prototype.get = function (name) {
            var cookieValue = "";
            var search = name + "=";
            if (document.cookie.length > 0) {
                offset = document.cookie.indexOf(search);
                if (offset != -1) {
                    offset += search.length;
                    end = document.cookie.indexOf(";", offset);
                    if (end == -1) end = document.cookie.length;
                    cookieValue = decodeURIComponent(document.cookie.substring(offset, end))
                }
            }
            return cookieValue;
        };
        fn.prototype.set = function (cookieName, cookieValue, DayValue) {
            var expire = "";
            var day_value = 1;
            if (DayValue != null) {
                day_value = DayValue;
            }
            expire = new Date((new Date()).getTime() + day_value * 86400000);
            expire = "; expires=" + expire.toGMTString();
            document.cookie = cookieName + "=" + encodeURIComponent(cookieValue) + ";path=/" + expire;
        }
        fn.prototype.remvoe = function (cookieName) {
            var expire = "";
            expire = new Date((new Date()).getTime() - 1);
            expire = "; expires=" + expire.toGMTString();
            document.cookie = cookieName + "=" + escape("") + ";path=/" + expire;
            /*path=/*/
        };

        return new fn();
    })();

    //右下角的提示框
    LG.tip = function (message) {
        if (LG.wintip) {
            LG.wintip.set('content', message);
            LG.wintip.show();
        }
        else {
            LG.wintip = $.ligerDialog.tip({content: message});
        }
        setTimeout(function () {
            LG.wintip.hide()
        }, 4000);
    };

    //预加载图片
    LG.prevLoadImage = function (rootpath, paths) {
        for (var i in paths) {
            $('<img />').attr('src', rootpath + paths[i]);
        }
    };
    //显示loading
    LG.showLoading = function (message) {
        message = message || "正在加载中...";
        $('body').append("<div class='jloading'>" + message + "</div>");
        $.ligerui.win.mask();
    };
    //隐藏loading
    LG.hideLoading = function (message) {
        $('body > div.jloading').remove();
        $.ligerui.win.unmask({id: new Date().getTime()});
    }
    //显示成功提示窗口
    LG.showSuccess = function (message, callback) {
        if (typeof (message) == "function" || arguments.length == 0) {
            callback = message;
            message = "操作成功!";
        }
        $.ligerDialog.success(message, '提示信息', callback);
    };
    //显示失败提示窗口
    LG.showError = function (message, callback) {
        if (typeof (message) == "function" || arguments.length == 0) {
            callback = message;
            message = "操作失败!";
        }
        $.ligerDialog.error(message, '提示信息', callback);
    };
    //显示操作信息,消息，自动关闭时间
    LG.showOperate = function (message,delay,notClose){
        var manager = $.ligerDialog.waitting(message);
        if(!notClose) setTimeout(function () { manager.close(); }, delay || 1000);
        return manager;
    };
    //显示确认框
    LG.showConfirm = function (message, title, callback){
        $.ligerDialog.confirm(message, title, callback);
    };

    // 校验弹窗
    LG.validateTip = function (tagre, options, seep) {
        seep = seep ? seep : 1000;
        var newTip = tagre.ligerTip($.extend({content: '数据错误', auto: true}, options));
        setTimeout(function () {
            var dom = newTip.tip || $(newTip.element);
            dom.fadeOut('normal', function () {newTip.remove();});
        }, seep);
    };


    //预加载dialog的图片
    LG.prevDialogImage = function (rootPath) {
        rootPath = rootPath || "";
        LG.prevLoadImage(rootPath + '/Content/ligerUI/skins/Aqua/images/win/', ['dialog-icons.gif']);
        LG.prevLoadImage(rootPath + '/Content/ligerUI/skins/Gray/images/win/', ['dialogicon.gif']);
    };

    //提交服务器请求
    //返回json格式
    //1,提交给类 options.type  方法 options.method 处理
    //2,并返回 AjaxResult(这也是一个类)类型的的序列化好的字符串
    LG.ajax = function (options) {
        //  var ashxUrl = options.ashxUrl || "/Admin/User/";
        //   var url = p.url || ashxUrl + $.param({ method: p.method });
        var p = $.extend({
            cache: false,
            async: true,
            contentType: "application/x-www-form-urlencoded;charset=UTF-8",
            dataType: 'json',
            type: 'post'
        }, (options || {}));

        $.ajax({
            cache: false,
            async: true,
            url: p.url,
            data: p.data,
            contentType: p.contentType,
            dataType: p.dataType,
            type: p.type,
            beforeSend: function () {
                LG.loading = true;
                if (p.beforeSend)
                    p.beforeSend();
                else
                    LG.showLoading(p.loading);
            },
            complete: function () {
                LG.loading = false;
                if (p.complete)
                    p.complete();
                else
                    LG.hideLoading();
            },
            success: function (result) {
                if (!result) return;
                if (!result.error) {
                    if (p.success)
                        p.success(result.data, result.message, result.code);
                }
                else {
                    if (p.error)
                        p.error(result.message, result.data, result.code);
                }
            },
            error: function (result, b) {
                LG.tip('发现系统错误 <BR>错误码：' + result.status);
                if(p.ajaxError){
                    p.ajaxError(result, b);
                }
            }
        });
    };

    //item为普通对象，或jq对象
    //会占用item的__ajaxLoading属性或给jq对象加disabled类
    LG.singleAjax = function (options, item) {

        if(item){
            if(item instanceof jQuery){
                if(item.hasClass("disabled")) return;
                item.addClass("disabled");
            }
            else{
                if(item.__ajaxLoading) return;
                item.__ajaxLoading = true;
            }
        }
        var p = $.extend({
            cache: false,
            async: true,
            contentType: "application/x-www-form-urlencoded;charset=UTF-8",
            dataType: 'json',
            type: 'post'
        }, (options || {}));

        $.ajax({
            cache: false,
            async: true,
            url: p.url,
            data: p.data,
            contentType: p.contentType,
            dataType: p.dataType,
            type: p.type,
            beforeSend: function () {
                if (p.beforeSend)
                    p.beforeSend();
            },
            complete: function () {
                if (p.complete)
                    p.complete();

                if(item){
                    if(item instanceof jQuery){
                        item.removeClass("disabled");
                    }
                    else{
                        item.__ajaxLoading = false;
                    }
                }
            },
            success: function (result) {
                if (!result) return;
                if (!result.error) {
                    if (p.success)
                        p.success(result.data, result.message, result.code);
                }
                else {
                    if (p.error)
                        p.error(result.message, result.code);
                }
            },
            error: function (result, b) {
                LG.tip('发现系统错误 <BR>错误码：' + result.status);
                if(p.ajaxError){
                    p.ajaxError(result, b);
                }
            }
        });
    };

    //获取当前页面的MenuNo
    //优先级1：如果页面存在MenuNo的表单元素，那么加载它的值
    //优先级2：加载QueryString，名字为MenuNo的值
    LG.getPageMenuNo = function () {
        var menuno = $("#MenuNo").val();
        if (!menuno) {
            menuno = getQueryStringByName("MenuNo");
        }
        return menuno;
    };

    //创建按钮
    LG.createButton = function (options) {
        var p = $.extend({
            appendTo: $('body')
        }, options || {});
        var btn = $('<div class="button button2 buttonnoicon" style="width:60px"><div class="button-l"> </div><div class="button-r"> </div> <span></span></div>');
        if (p.icon) {
            btn.removeClass("buttonnoicon");
            btn.append('<div class="button-icon"> <img src="' + p.icon + '" /> </div> ');
        }
        //绿色皮肤
        if (p.green) {
            btn.removeClass("button2");
        }
        if (p.width) {
            btn.width(p.width);
        }
        if (p.click) {
            btn.click(p.click);
        }
        if (p.text) {
            $("span", btn).html(p.text);
        }
        if (typeof (p.appendTo) == "string") p.appendTo = $(p.appendTo);
        btn.appendTo(p.appendTo);
        return btn;
    };

    //创建过滤规则(查询表单)
    LG.bulidFilterGroup = function (form) {
        if (!form) return null;
        var group = {op: "and", rules: []};
        $(":input", form).not(":submit, :reset, :image,:button, [disabled]")
            .each(function () {
                if (!this.name) return;
                if (!$(this).hasClass("field")) return;
                if ($(this).val() == null || $(this).val() == "") return;
                var ltype = $(this).attr("ltype");
                var optionsJSON = $(this).attr("ligerui"), options;
                if (optionsJSON) {
                    options = JSON2.parse(optionsJSON);
                }
                var op = $(this).attr("op") || "like";
                //get the value type(number or date)
                var type = $(this).attr("vt") || "string";
                var value = $(this).val();
                var name = this.name;
                //如果是下拉框，那么读取下拉框关联的隐藏控件的值(ID值,常用与外表关联)
                if (ltype == "select" && options && options.valueFieldID) {
                    value = $("#" + options.valueFieldID).val();
                    name = options.valueFieldID;
                }
                if (op == 'lessorequal' && ltype == 'date') {
                    value = value + ' 23:59:59';
                }
                group.rules.push({
                    op: op,
                    field: name,
                    value: value,
                    type: type
                });
            });
        return group;
    };

    //附加表单搜索按钮：搜索、高级搜索
    LG.appendSearchButtons = function (form, grid, withDr) {
        if (!form) return;
        form = $(form);
        //搜索按钮 附加到第一个li  高级搜索按钮附加到 第二个li
        var container = $('<ul><li style="margin-right:8px"></li><li></li></ul><div class="l-clear"></div>').appendTo(form);

        LG.addSearchButtons(form, grid, container.find("li:eq(0)"), container.find("li:eq(1)"), withDr);

    };


    //创建表单搜索按钮：搜索、高级搜索
    LG.addSearchButtons = function (form, grid, btn1Container, btn2Container, withDr) {
        if (!form) return;
        if (btn1Container) {
            var searchBtn = LG.createButton({
                appendTo: btn1Container,
                text: '搜索',
                click: function () {
                    var rule = LG.bulidFilterGroup(form);
                    if (rule.rules.length) {
                        if (withDr) {
                            dr = {field: 'dr', value: 0, op: 'equal'};
                            rule.rules.push(dr);
                            // grid.set('parms', { where: JSON2.stringify(rule) });
                            grid.set('parms', [{name: 'where', value: JSON2.stringify(rule)}])
                        } else {
                            // grid.set('parms', { where: JSON2.stringify(rule) });
                            grid.set('where', {where: JSON2.stringify(rule)});
                        }
                    } else {
                        if (withDr) {
                            var dr = {
                                op: 'and',
                                rules: [{field: 'dr', value: 0, op: 'equal'}]
                            };
                            // grid.set('parms', [{ where: JSON2.stringify(dr) }]);
                            grid.set('parms', [{name: 'where', value: JSON2.stringify(rule)}])
                        } else {
                            grid.set('parms', []);
                        }

                    }
                    grid.set('parms', []);
                    grid.changePage('first');
                    grid.loadData();
                }
            });

            $(document).keydown(function (e) {
                if (e.keyCode == 13) {
                    searchBtn.trigger("click");
                }
            });
        }
        if (btn2Container) {
            LG.createButton({
                appendTo: btn2Container,
                width: 80,
                text: '高级搜索',
                click: function () {
                    grid.showFilter();
                }
            });
        }
    };


    //附加表单搜索按钮：搜索、高级搜索、重置
    LG.appendSearchAndRestBtn = function (form, grid, data) {

        if (!form) return;

        //搜索按钮 附加到第一个li  高级搜索按钮附加到 第二个li
        var container = $('<ul><li style="margin-right:8px"></li><li></li><li style="margin-left:8px"></li></ul><div class="l-clear"></div>').appendTo($(form));

        LG.addSearchAndRestBtn(form, grid, container.find("li:eq(0)"), container.find("li:eq(1)"), container.find("li:eq(2)"), data);

    };


    //附加表单搜索按钮：搜索、高级搜索、重置
    LG.appendSearchAndRestBtn = function (form, grid, data, appendParms) {

        if (!form) return;

        //搜索按钮 附加到第一个li  高级搜索按钮附加到 第二个li
        var container = $('<ul class="filter-btn-wrapper"><li style="margin-right:8px"></li><li></li><li style="margin-left:8px"></li></ul><div class="l-clear"></div>').appendTo($(form));

        LG.addSearchAndRestBtn(form, grid, container.find("li:eq(0)"), container.find("li:eq(1)"), container.find("li:eq(2)"), data, appendParms);

    };

    //创建表单搜索按钮：搜索,高级搜索,重置,重置数据,默认过滤条件
    LG.addSearchAndRestBtn = function (ligerForm, grid, btn1Container, btn2Container, btn3Container, data, appendParms) {

        var form = $(ligerForm);

        if (!form) return;
        if (btn1Container) {
            var searchBtn = LG.createButton({
                appendTo: btn1Container,
                text: '搜索',
                click: function () {
                    var rule = LG.bulidFilterGroup(form);
                    if (rule.rules.length) {
                        dr = {field: 'dr', value: 0, op: 'equal'};
                        rule.rules.push(dr);
                        //添加默认条件
                        if (appendParms) {
                            for (i  in appendParms) {
                                rule.rules.push(appendParms[i]);
                            }
                        }
                        grid.set('parms', [{name: 'where', value: JSON2.stringify(rule)}]);
                    } else {
                        var dr = {
                            op: 'and',
                            rules: [{field: 'dr', value: 0, op: 'equal'}]
                        };
                        if (appendParms) {
                            for (i  in appendParms) {
                                dr.rules.push(appendParms[i]);
                            }
                        }
                        grid.set('parms', [{name: 'where', value: JSON2.stringify(dr)}]);
                    }
                    grid.changePage('first');
                    grid.loadData();
                }
            });

            $(document).keydown(function (e) {
                if (e.keyCode == 13) {
                    searchBtn.trigger("click");
                }
            });

        }
        /*    if (btn2Container) {
         LG.createButton({
         appendTo: btn2Container,
         width: 80,
         text: '高级搜索',
         click: function () {
         grid.showFilter();
         }
         });
         }*/

        if (btn3Container) {
            LG.createButton({
                appendTo: btn3Container,
                width: 80,
                text: '重置',
                click: function () {

                    var lform = $.ligerui.get(ligerForm.replace("#", ""));
                    if (lform) {
                        $(":input", form).not(":submit, :reset, :image,:button, [disabled]").each(function () {
                            if (!this.name) return;
                            if (!$(this).hasClass("field")) return;
                            $(this).val("");
                        });

                        lform.setData(data);
                    }

                }
            });
        }
    };


    //创建表单搜索按钮：搜索、高级搜索
    /* LG.addSearchAndRestBtn = function (ligerForm, grid, btn1Container, btn2Container, btn3Container, data) {

     var form = $(ligerForm);

     if (!form) return;
     if (btn1Container) {
     var searchBtn = LG.createButton({
     appendTo: btn1Container,
     width: 80,
     text: '搜索',
     click: function () {
     var rule = LG.bulidFilterGroup(form);
     var param = {}
     if (rule.rules.length) {
     dr = { field: 'dr', value: 0, op: 'equal' };
     rule.rules.push(dr);
     grid.set('parms', [{ name: 'where', value: JSON2.stringify(rule) }])
     } else {
     var dr = {
     op: 'and',
     rules: [{ field: 'dr', value: 0, op: 'equal' }]
     };
     grid.set('parms', [{ name: 'where', value: JSON2.stringify(dr) }])
     }
     grid.changePage('first');
     grid.loadData();
     }
     });

     $(document).keydown(function (e) {
     if (e.keyCode == 13) {
     searchBtn.trigger("click");
     e.preventDefault();
     }
     });

     }
     //        if (btn2Container) {
     //            LG.createButton({
     //                appendTo: btn2Container,
     //                width: 80,
     //                text: '高级搜索',
     //                click: function () {
     //                    grid.showFilter();
     //                }
     //            });
     //        }

     if (btn3Container) {
     LG.createButton({
     appendTo: btn3Container,
     width: 80,
     text: '重置',
     click: function () {

     var lform = $.ligerui.get(ligerForm.replace("#", ""));
     if (lform) {
     $(":input", form).not(":submit, :reset, :image,:button, [disabled]").each(function () {
     if (!this.name) return;
     if (!$(this).hasClass("field")) return;
     $(this).val("");
     });

     lform.setData(data);
     }

     }
     });
     }
     };*/


    //快速设置表单底部默认的按钮:保存、取消
    LG.setFormDefaultBtn = function (cancleCallback, savedCallback) {
        //表单底部按钮
        var buttons = [];
        if (cancleCallback) {
            buttons.push({text: '取消', onclick: cancleCallback});
        }
        if (savedCallback) {
            buttons.push({text: '保存', onclick: savedCallback});
        }
        LG.addFormButtons(buttons);
    };

    //增加表单底部按钮,比如：保存、取消
    LG.addFormButtons = function (buttons) {
        if (!buttons) return;
        var formbar = $("body > div.form-bar");
        if (formbar.length == 0)
            formbar = $('<div class="form-bar"><div class="form-bar-inner"></div></div>').appendTo('body');
        if (!(buttons instanceof Array)) {
            buttons = [buttons];
        }
        $(buttons).each(function (i, o) {
            var btn = $('<div class="l-dialog-btn"><div class="l-dialog-btn-l"></div><div class="l-dialog-btn-r"></div><div class="l-dialog-btn-inner"></div></div> ');
            $("div.l-dialog-btn-inner:first", btn).html(o.text || "BUTTON");
            if (o.onclick) {
                btn.on('click', function () {
                    o.onclick(o);
                });
            }
            if (o.width) {
                btn.width(o.width);
            }
            $("> div:first", formbar).append(btn);
        });
    };

    //填充表单数据
    LG.loadForm = function (mainform, options, callback) {
        options = options || {};
        if (!mainform)
            mainform = $("form:first");
        var p = $.extend({
            beforeSend: function () {
                LG.showLoading('正在加载表单数据中...');
            },
            complete: function () {
                LG.hideLoading();
            },
            success: function (data) {
                var preID = options.preID || "";
                //根据返回的属性名，找到相应ID的表单元素，并赋值
                for (var p in data) {
                    var ele = $("[name=" + (preID + p) + "]", mainform);

                    //针对复选框和单选框 处理
                    if (ele.is(":checkbox,:radio")) {
                        ele[0].checked = data[p] ? true : false;
                    }
                    else {
                        ele.val(data[p]);
                    }
                }
                //下面是更新表单的样式
                var managers = $.ligerui.find($.ligerui.controls.Input);
                for (var i = 0, l = managers.length; i < l; i++) {
                    //改变了表单的值，需要调用这个方法来更新ligerui样式
                    var o = managers[i];
                    o.updateStyle();
                    if (managers[i] instanceof $.ligerui.controls.TextBox)
                        o.checkValue();
                }
                if (callback)
                    callback(data);
            },
            error: function (message) {
                LG.showError('数据加载失败!<BR>错误信息：' + message);
            }
        }, options);
        LG.ajax(p);
    };

    //带验证、带loading的提交
    LG.submitForm = function (mainform, success, error) {
        if (!mainform)
            mainform = $("form:first");
        if (mainform.valid()) {
            mainform.ajaxSubmit({
                dataType: 'json',
                success: success,
                beforeSubmit: function (formData, jqForm, options) {
                    //针对复选框和单选框 处理
                    $(":checkbox,:radio", jqForm).each(function () {
                        if (!existInFormData(formData, this.name)) {
                            formData.push({name: this.name, type: this.type, value: this.checked});
                        }
                    });
                    for (var i = 0, l = formData.length; i < l; i++) {
                        var o = formData[i];
                        if (o.type == "checkbox" || o.type == "radio") {
                            o.value = $("[name=" + o.name + "]", jqForm)[0].checked ? "true" : "false";
                        }
                    }
                },
                beforeSend: function (a, b, c) {
                    LG.showLoading('正在保存数据中...');

                },
                complete: function () {
                    LG.hideLoading();
                },
                error: function (result) {
                    LG.tip('发现系统错误 <BR>错误码：' + result.status);
                }
            });
        }
        else {
            LG.showInvalid();
        }
        function existInFormData(formData, name) {
            for (var i = 0, l = formData.length; i < l; i++) {
                var o = formData[i];
                if (o.name == name) return true;
            }
            return false;
        }
    };

    //提示 验证错误信息
    LG.showInvalid = function (validator) {
        validator = validator || LG.validator;
        if (!validator) return;
        var message = '<div class="invalid">存在' + validator.errorList.length + '个字段验证不通过，请检查!</div>';
        //top.LG.tip(message);
        $.ligerDialog.error(message);
    };

    //消除校验格式
    LG.clearValid = function (form) {
        $(":input", form).not(":submit, :reset, :image,:button, [disabled]")
            .each(function () {
                if (!this.name) return;

                var element = $(this);

                if (element.hasClass("l-textarea")) {
                    element.removeClass("l-textarea-invalid");
                }
                else if (element.hasClass("l-text-field")) {
                    element.parent().removeClass("l-text-invalid");
                }
                $(element).removeAttr("title").ligerHideTip();

            });
    }

    //表单验证
    LG.validate = function (form, options) {
        if (typeof (form) === "string") {
            form = $(form);
        }
        else if (typeof (form) === "object" && form.NodeType === 1) {
            form = $(form);
        }

        options = $.extend({
            errorPlacement: function (lable, element) {
                if (!element.attr("id"))
                    element.attr("id", new Date().getTime());
                if (element.hasClass("l-textarea")) {
                    element.addClass("l-textarea-invalid");
                }
                else if (element.hasClass("l-text-field")) {
                    element.parent().addClass("l-text-invalid");
                }
                $(element).removeAttr("title").ligerHideTip();
                $(element).attr("title", lable.html()).ligerTip({
                    distanceX: 5,
                    distanceY: -3,
                    auto: true
                });
            },
            success: function (lable) {
                if (!lable.attr("for")) return;
                var element = $("#" + lable.attr("for"));

                if (element.hasClass("l-textarea")) {
                    element.removeClass("l-textarea-invalid");
                }
                else if (element.hasClass("l-text-field")) {
                    element.parent().removeClass("l-text-invalid");
                }
                $(element).removeAttr("title").ligerHideTip();
            }
        }, options || {});
        LG.validator = form.validate(options);
        return LG.validator;
    };


    //三个参数,第三个为默认的菜单元素(一般为不和服务器发生交互的菜单按钮)
    LG.loadToolbar = function (grid, toolbarBtnItemClick, toolbarDefaultOptions) {
        var MenuNo = LG.getPageMenuNo();
        LG.ajax({
            loading: '正在加载工具条中...',
            //url: rootPath + 'Manage/GetMyButton',
            url: '/Admin/Manage/GetMyButton',
            data: {MenuNo: MenuNo},
            success: function (data) {
                if (!grid.toolbarManager) return;
                //if (!data || !data.length) return;
                var items = [];
                //添加服务端的按钮
                for (var i = 0, l = data.length; i < l; i++) {
                    var o = data[i];
                    items[items.length] = {
                        click: toolbarBtnItemClick,
                        text: o.BtnName,
                        img: o.BtnIcon,
                        id: o.BtnNo
                    };
                    items[items.length] = {line: true};
                }
                if (toolbarDefaultOptions) {
                    for (var i = 0, l = toolbarDefaultOptions.length; i < l; i++) {
                        items[items.length] = {
                            click: toolbarBtnItemClick,
                            text: toolbarDefaultOptions[i].text,
                            img: toolbarDefaultOptions[i].img,
                            id: toolbarDefaultOptions[i].id
                        };
                    }
                }
                //如果客户端存在按钮则添加客户端的按钮(一般代表没有和服务器发生交互的事件)
                grid.toolbarManager.set('items', items);
            }
        });
    };

    //关闭Tab项,如果tabid不指定，那么关闭当前显示的
    LG.closeCurrentTab = function (tabid) {
        if (!tabid) {
            tabid = $("#framecenter > .l-tab-content > .l-tab-content-item:visible").attr("tabid");
        }
        if (tab) {
            tab.removeTabItem(tabid);
        }
    };


    LG.clearFlash = function () {
        $.extend($.ligerDefaults.Tab, {
            onBeforeRemoveTabItem: function (tabid) {
                alert(tabid);
            }
        });
    };

    //关闭Tab项并且刷新父窗口
    LG.closeAndReloadParent = function (tabid, parentMenuNo) {
        LG.closeCurrentTab(tabid);
        var menuitem = $("#mainmenu ul.menulist li[menuno=" + parentMenuNo + "]");
        var parentTabid = menuitem.attr("tabid");
        var iframe = window.frames[parentTabid];
        if (tab) {
            tab.selectTabItem(parentTabid);
        }
        if (iframe && iframe.f_reload) {
            iframe.f_reload();
        }
        else if (tab) {
            tab.reload(parentTabid);
        }
    };

    //覆盖页面grid的loading效果
    LG.overrideGridLoading = function () {
        $.extend($.ligerDefaults.Grid, {
            onloading: function () {
                LG.showLoading('正在加载表格数据中...');
            },
            onloaded: function () {
                LG.hideLoading();
            }
        });
    };

    //dr
    LG.fliterDrGrid = function () {
        $.extend($.ligerDefaults.Grid, {
            onLoadData: function () {
                var parms = this.get("parms");

                if (parms.where) {
                    rule = {field: 'dr', value: 0, op: 'equal'};
                    var where = JSON2.parse(parms.where);
                    where.rules.push(rule);
                    parms.where = JSON2.stringify(where);
                    this.set('parms', parms);
                }
                else {
                    var dr = {
                        op: 'or',
                        rules: [{field: 'dr', value: 0, op: 'equal'}, {field: 'dr', op: 'isnull'}]
                    };
                    parms.where = JSON2.stringify(dr);
                    this.set('parms', parms);
                }
            }
        });
    };

    //根据字段权限调整 页面配置
    LG.adujestConfig = function (config, forbidFields) {
        if (config.Form && config.Form.fields) {
            for (var i = config.Form.fields.length - 1; i >= 0; i--) {
                var field = config.Form.fields[i];
                if ($.inArray(field.name, forbidFields) != -1)
                    config.Form.fields.splice(i, 1);
            }
        }
        if (config.Grid && config.Grid.columns) {
            for (var i = config.Grid.columns.length - 1; i >= 0; i--) {
                var column = config.Grid.columns[i];
                if ($.inArray(column.name, forbidFields) != -1)
                    config.Grid.columns.splice(i, 1);
            }
        }
        if (config.Search && config.Search.fields) {
            for (var i = config.Search.fields.length - 1; i >= 0; i--) {
                var field = config.Search.fields[i];
                if ($.inArray(field.name, forbidFields) != -1)
                    config.Search.fields.splice(i, 1);
            }
        }
    };

    //查找是否存在某一个按钮
    LG.findToolbarItem = function (grid, itemID) {
        if (!grid.toolbarManager) return null;
        if (!grid.toolbarManager.options.items) return null;
        var items = grid.toolbarManager.options.items;
        for (var i = 0, l = items.length; i < l; i++) {
            if (items[i].id == itemID) return items[i];
        }
        return null;
    }


    //设置grid的双击事件(带权限控制)
    LG.setGridDoubleClick = function (grid, btnID, btnItemClick) {
        btnItemClick = btnItemClick || toolbarBtnItemClick;
        if (!btnItemClick) return;
        grid.on('dblClickRow', function (rowdata) {
            var item = LG.findToolbarItem(grid, btnID);
            if (!item) return;
            grid.select(rowdata);
            btnItemClick(item);
        });
    }

    //增加必输标示..试用与1.19版本
    LG.addValidateStyle = function (formName) {
        var form = $.ligerui.get(formName);
        if (form) {
            var fields = form.options.fields;
            for (var i in fields) {
                if (fields[i].validate && fields[i].validate.required) {
                    +$("input[name=" + fields[i].name + "]", $("#" + formName)).parent().parent().next(":not(:has(span))").append("<span class='l-star' style='color: red;'>*</span>");
                }
            }
        }
    }

    //弹框形式的form
    LG.openFormDialog = function (form, fields, validate, options, data, callback, status) {
        //ligerui 对象
        var formPanel, win, dlg;
        //初始化
        var win = $("<div></div>");
        var formPanel = $("<form></form>");
        //放入页面的DIV中
        $(form).append(win);
        win.append(formPanel);

        //构建ligerForm
        var lform = formPanel.ligerForm({
            fields: fields,
            validate: validate,
            inputWidth: 220, //控件宽度
            labelWidth: 100,//标签宽度            
            space: 30//间隔宽度
        });

        //初始化值
        if (data) {
            lform.setData(data);
        }
        else {

        }
        //dialog参数初始化,合并
        options = $.extend({
            showType: 'slide',
            width: 390
        }, options || {});

        $.extend(options, {
            target: win,
            buttons: [
                {
                    text: '确定', onclick: function () {
                    callback(dlg, lform, status);
                }
                },
                {
                    text: '取消', onclick: function () {
                    dlg.close();
                }
                }
            ]
        });
        //弹出框
        dlg = $.ligerDialog.open(options);
    };


    // 经过权限判断的工具栏
    // @parm target    元素
    // @parm options   配置
    LG.powerToolBar = function (target, options) {
        // console.log(options);
        if (!target || !options || options.items.length < 1) return false;
        if (disabledButtons.length < 0) return target.ligerToolBar(options);

        var items= options.items;
        var newItems = [];
        for (var i = 0, len = items.length; i < len; i++){
            var item = items[i];
            if (item.menu) {
                var newMenu = [];
                for (var j = 0, jlen = item.menu.items.length; j < jlen; j++) {
                    var jitem = item.menu.items[j];
                    !(disabledButtons.indexOf(jitem.id) >= 0) && newMenu.push(jitem);
                }
                item.menu.items = newMenu;
                (newMenu.length === 0) && disabledButtons.push(item.id);
            }
            if (disabledButtons.indexOf(item.id) === -1) {
                newItems.push(item);
            }
        }
        options.items = newItems;
        // console.log('powerToolBar %o', options);
        return target.ligerToolBar(options);
    }

    // 判断特殊字段
    // @parm options         请求配置（LG.ajax）
    // @parm title           提示
    LG.ajaxSpecialField = function (options) {
        if (!options) return;
        var option = $.extend(options, {
            success: function (data) {
                for (var i = data.data.length - 1; i >= 0; i--) {
                    var item = data[i];
                    var target = liger.get(item.name),
                         targetParent = target.wrapper;
                    target.width(targetParent.width - 40);
                    targetParent.css('icon-alert', 'relative');
                    LG.specialField(targetParent, item.type);
                }
                options.success(data);
            }
        });
        LG.ajax(option);
    };

    // 添加警告提示
    // @parm target          目标元素
    // @parm type            类型
    LG.specialField = function (target, type, title) {
        if(!target) return;
        var titleList = {
            'alert': '未录入'
        };
        if (target.children('.icon-type').length > 1) {
            target.children('.icon-type').attr({
                'class': 'icon-type icon-' + (type || 'none'),
                'title': (title || titleList[type])
            });
        } else {
            target.append('<span class="icon-type icon-' + (type || 'none') + '" title="' + (title || titleList[type]) + '"></span>');
        }
    };

    // 删除警告提示
    LG.clearspecial = function (target) {
        if(!target) return;
        if (target.children('.icon-type').length >= 1) {
            target.children('.icon-type').fadeOut().remove();
        }
    };

})(jQuery);
﻿/*
 默认参数 扩展
 */

$.extend($.ligerDefaults.Grid, {
    rowHeight: 30,
    checkbox: true,
    fixedCellHeight: false,
    frozen: false,
    async: true,
    headerRowHeight: 30,
    allowUnSelectRow: true,
    onError: function (result, b) {
        LG.tip('发现系统错误 ' + b);
    }
});

$.extend($.ligerDefaults.Tab, {
    contextmenu: false
});

/*
 表格 扩展
 */

$.extend($.ligerui.controls.Grid.prototype, {
    _initBuildHeader: function () {
        var g = this, p = this.options;
        if (p.title) {
            $(".l-panel-header-text", g.header).html(p.title);
            if (p.headerImg)
                g.header.append("<img src='" + p.headerImg + "' />").addClass("l-panel-header-hasicon");
        }
        else {
            g.header.hide();
        }
        if (p.toolbar) {
            if ($.fn.ligerToolBar)
                g.toolbarManager = g.topbar.ligerToolBar(p.toolbar);
        }
        else {
            g.topbar.remove();
        }
    },
    /**
     *
     *  defaultSearch={
     * and:[],//直接加入and条件
     * or:[[],[]]//加入多组or条件
     * }
     * */
    getSearchGridData: function (dr,value,defaultField){
        var grid = this,
            data = {op: "and", rules: [], groups: []};
        //加入默认字段
        if(dr){
            data.rules.push({
                field: 'dr', value: 0, op: 'equal', type: 'int'
            });
        }
        if(defaultField){
            data.rules = data.rules.concat(defaultField.and);
            addDefaultOr(data.groups,defaultField.or);
        }
    
        data.groups[data.groups.length] = {
            op: "or",
            rules:[]
        };
        if(value){
            addRules(grid, data.groups[data.groups.length - 1].rules,value);
        }
    
        return JSON2.stringify(data);
    
        function addDefaultOr(groups,orArr){
            for(var i = 0,len=orArr.length;i<len;i++){
                groups.push({
                    op: "or",
                    rules:[].concat(orArr[i])
                });
            }
        }
    
        function addRules(grid,rules,value){
            var cols = grid.columns,name,col;
    
            for(var i = 0,len = cols.length;i<len;i++){
                col = cols[i];
                if(col["quickSort"] !== false){
                    name =col.name;
                    if(name){
                        rules.push({
                            op: "like",
                            field: name,
                            value: value,
                            type: "string"
                        });
                    }
                }
            }
        }
    },
    addEditRow: function (rowdata) {
        var g = this;
        rowdata = g.add(rowdata);
        return g.beginEdit(rowdata);
    },
    getEditingRow: function () {
        var g = this;
        for (var i = 0, l = g.rows.length; i < l; i++) {
            if (g.rows[i]._editing) return g.rows[i];
        }
        return null;
    },
    getChangedRows: function () {
        var g = this, changedRows = [];
        pushRows(g.getDeleted(), 'delete');
        pushRows(g.getUpdated(), 'update');
        pushRows(g.getAdded(), 'add');
        return changedRows;

        function pushRows(rows, status) {
            if (!rows || !rows instanceof Array) return;
            for (var i = 0, l = rows.length; i < l; i++) {
                changedRows.push($.extend({}, rows[i], {__status: status}));
            }
        }

    }
});

/*
 表格格式化函数扩展
 */



//扩展 percent 百分比 类型的格式化函数(0到1之间)
$.ligerDefaults.Grid.formatters['percent'] = function (value, column) {
    if (value < 0) value = 0;
    if (value > 1) value = 1;
    var precision = column.editor.precision || 0;
    return (value * 100).toFixed(precision) + "%";
};

//扩展 numberbox 类型的格式化函数
$.ligerDefaults.Grid.formatters['numberbox'] = function (value, column) {
    var precision = column.editor.precision || 0;
    return value.toFixed(precision);
};
//扩展 currency 类型的格式化函数
$.ligerDefaults.Grid.formatters['currency'] = function (num, column) {
    //num 当前的值
    //column 列信息
    if (!num) return "0.00";
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0.00";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
    return "" + (((sign) ? '' : '-') + '' + num + '.' + cents);
};

/*
 表格编辑器
 */

//扩展一个 百分比输入框 的编辑器(0到1之间)
$.ligerDefaults.Grid.editors['percent'] = {
    create: function (container, editParm) {
        var column = editParm.column;
        var precision = column.editor.precision || 0;
        var input = $("<input type='text' style='text-align:right' class='l-text' />");
        input.bind('keypress', function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            return keyCode >= 48 && keyCode <= 57 || keyCode == 46 || keyCode == 8;
        });
        input.bind('blur', function () {
            var showVal = input.val();
            showVal.replace('%', '');
            input.val(parseFloat(showVal).toFixed(precision));
        });
        container.append(input);
        return input;
    },
    getValue: function (input, editParm) {
        var showVal = input.val();
        showVal.replace('%', '');
        var value = parseFloat(showVal) * 0.01;
        if (value < 0) value = 0;
        if (value > 1) value = 1;
        return value;
    },
    setValue: function (input, value, editParm) {
        var column = editParm.column;
        var precision = column.editor.precision || 0;
        if (value < 0) value = 0;
        if (value > 1) value = 1;
        var showVal = (value * 100).toFixed(precision) + "%";
        input.val(showVal);
    },
    resize: function (input, width, height, editParm) {
        input.width(width).height(height);
    }
};

/**
 * 扩展一个 新的数字输入 的编辑器（by:wujian  创建于：2016-12-08 最后修改于：2017-01-17）
 * ext（或p）可选参数（对象，如果是一个函数，则调用此函数）：
 * attr 加入input的属性，如maxlength
 * type 类型：int或float（整数或者非整数）
 * minValue和maxValue
 * defaultValue：当输入不合法时返回的值，默认为空字符串
 * precision: 小数位数（设置此参数将返回字符串形式的值）
 * */
$.ligerDefaults.Grid.editors['newnumberbox'] = {
    create: function (container, editParm) {
        var input = $("<input type='text' />");
        var column = editParm.column,
            ext = column.editor.p || column.editor.ext;
        var p = {
            attr: null,
            type: "float",
            minValue: null,
            maxValue: null,
            defaultValue: ""
        };
        if (ext) {
            var tmp = typeof ext === 'function' ? ext(editParm.record, editParm.rowindex, editParm.value, editParm.column) : ext;
            $.extend(p, tmp);
        }

        input.bind('keypress', function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            //数字 || 点 ||  负号 ||退格
            return keyCode >= 48 && keyCode <= 57 || keyCode == 46 || keyCode == 45 || keyCode == 8;
        });

        var attrOption = p.attr;
        if(attrOption){
            input.attr(attrOption);
        }
        container.append(input);
        input.ligerTextBox(p);
        return input;
    },
    getValue: function (input, editParm) {
        var column = editParm.column,
            ext = column.editor.p || column.editor.ext,
            value;
        var p = {
            attr: null,
            type: "float",
            minValue: null,
            maxValue: null,
            defaultValue: "",
            precision: null
        };
        if (ext) {
            var tmp = typeof ext === 'function' ? ext(editParm.record, editParm.rowindex, editParm.value, editParm.column) : ext;
            $.extend(p, tmp);
        }

        if (p.type === "int"){
            value = parseInt(input.val(), 10);
        }
        else{
            value = parseFloat(input.val());
        }
        if(isNaN(value) || (p.minValue !== null && value < p.minValue) || (p.maxValue !== null && value > p.maxValue)){
            return p.defaultValue;
        }
        else{
            return p.precision ? value.toFixed(p.precision) : value;
        }

    },
    setValue: function (input, value, editParm) {
        input.val(value);
    },
    resize: function (input, width, height, editParm) {
        input.liger('option', 'width', width - 8);
        input.liger('option', 'height', height);
    },
    destroy: function (input, editParm) {
        input.liger('destroy');
    }
};

//扩展一个 数字输入 的编辑器
$.ligerDefaults.Grid.editors['numberbox'] = {
    create: function (container, editParm) {
        var column = editParm.column;
        var precision = column.editor.precision;
        var input = $("<input type='text' style='text-align:right' class='l-text' />");
        input.bind('keypress', function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            return keyCode >= 48 && keyCode <= 57 || keyCode == 46 || keyCode == 8;
        });
        input.bind('blur', function () {
            var value = input.val();
            input.val(parseFloat(value).toFixed(precision));
        });
        container.append(input);
        return input;
    },
    getValue: function (input, editParm) {
        return parseFloat(input.val());
    },
    setValue: function (input, value, editParm) {
        var column = editParm.column;
        var precision = column.editor.precision;
        input.val(value.toFixed(precision));
    },
    resize: function (input, width, height, editParm) {
        input.width(width).height(height);
    }
};

$.ligerDefaults.Grid.editors['date'] = {
    create: function (container, editParm) {
        var column = editParm.column;
        var input = $("<input type='text'/>");
        container.append(input);
        var options = {};
        var ext = column.editor.p || column.editor.ext;
        if (ext) {
            var tmp = typeof (ext) == 'function' ?
                ext(editParm.record, editParm.rowindex, editParm.value, column) : ext;
            $.extend(options, tmp);
        }
        input.ligerDateEditor(options);
        return input;
    },
    getValue: function (input, editParm) {
        return input.liger('option', 'value');
    },
    setValue: function (input, value, editParm) {
        input.liger('option', 'value', value);
    },
    resize: function (input, width, height, editParm) {
        input.liger('option', 'width', width);
        input.liger('option', 'height', height);
    },
    destroy: function (input, editParm) {
        input.liger('destroy');
    }
};

$.ligerDefaults.Grid.editors['select'] =
    $.ligerDefaults.Grid.editors['combobox'] =
    {
        create: function (container, editParm) {
            var column = editParm.column;
            var input = $("<input type='text'/>");
            container.append(input);
            var options = {
                data: column.editor.data,
                slide: false,
                valueField: column.editor.valueField || column.editor.valueColumnName,
                textField: column.editor.textField || column.editor.displayColumnName
            };
            var ext = column.editor.p || column.editor.ext;
            if (ext) {
                var tmp = typeof (ext) == 'function' ?
                    ext(editParm.record, editParm.rowindex, editParm.value, column) : ext;
                $.extend(options, tmp);
            }
            input.ligerComboBox(options);
            return input;
        },
        getValue: function (input, editParm) {
            return input.liger('option', 'value');
        },
        setValue: function (input, value, editParm) {
            input.liger('option', 'value', value);
        },
        resize: function (input, width, height, editParm) {
            input.liger('option', 'width', width - 2);
            input.liger('option', 'height', height);
        },
        destroy: function (input, editParm) {
            input.liger('destroy');
        }
    };

$.ligerDefaults.Grid.editors['int'] =
    $.ligerDefaults.Grid.editors['float'] =
        $.ligerDefaults.Grid.editors['spinner'] =
        {
            create: function (container, editParm) {
                var column = editParm.column;
                var input = $("<input type='text'/>");
                container.append(input);
                input.css({border: '#6E90BE'})
                var options = {
                    type: column.editor.type == 'float' ? 'float' : 'int'
                };

                /**
                 * 2016-09修复行内编辑文本框传入选项
                 * @type {{}}
                 */
                var ext = editParm.column.editor.p || editParm.column.editor.ext;
                if (ext) {
                    var tmp = typeof (ext) == 'function' ?
                        ext(editParm.record, editParm.rowindex, editParm.value, editParm.column) : ext;
                    $.extend(options, tmp);
                }

                if (column.editor.minValue != undefined) options.minValue = column.editor.minValue;
                if (column.editor.maxValue != undefined) options.maxValue = column.editor.maxValue;
                input.ligerSpinner(options);
                return input;
            },
            /**
             * 2016-12-08 不出现NaN
             * */
            getValue: function (input, editParm) {
                var column = editParm.column,
                    isInt = column.editor.type == "int",
                    value;
                if (isInt)
                    value = parseInt(input.val(), 10);
                else
                    value = parseFloat(input.val());
                return isNaN(value) ? "" : value;
            },
            setValue: function (input, value, editParm) {
                input.val(value);
            },
            resize: function (input, width, height, editParm) {
                input.liger('option', 'width', width - 8);
                input.liger('option', 'height', height);
            },
            destroy: function (input, editParm) {
                input.liger('destroy');
            }
        };


$.ligerDefaults.Grid.editors['string'] =
    $.ligerDefaults.Grid.editors['text'] = {
        create: function (container, editParm) {
            var input = $("<input type='text' class='l-text-editing'/>");
            if (typeof (editParm.column.validate) == "string") {
                input.attr("validate", editParm.column.validate);
            }
            else if (editParm.column.validate && typeof (editParm.column.validate) == "object") {
                input.attr("validate", JSON2.stringify(editParm.column.validate));
            }
            if (editParm.grid) {
                var id = editParm.grid.id + "_editor_" + editParm.grid.editorcounter++ + "_" + new Date().getTime();
                input.attr("name", id).attr("id", id);
            }
            /**
             * 2016-09修复行内编辑文本框传入选项
             * @type {{}}
             */
            var options = {};
            var ext = editParm.column.editor.p || editParm.column.editor.ext;
            if (ext) {
                var tmp = typeof (ext) == 'function' ?
                    ext(editParm.record, editParm.rowindex, editParm.value, editParm.column) : ext;
                $.extend(options, tmp);
            }
            /**
             * 2016-12-08 增加attr的支持，加入自定义属性，如maxlength等（注：表单默认就支持，只是表格里的输入框不支持）
             * */
            var attrOption = options.attr;
            if(attrOption){
                for(var attrItem in attrOption){
                    input.attr(attrItem, attrOption[attrItem]);
                }
            }
            container.append(input);
            input.ligerTextBox(options);
            return input;
        },
        getValue: function (input, editParm) {
            return input.val();
        },
        setValue: function (input, value, editParm) {
            input.val(value);
        },
        resize: function (input, width, height, editParm) {
            input.liger('option', 'width', width - 8);
            input.liger('option', 'height', height);
        },
        destroy: function (input, editParm) {
            input.liger('destroy');
        }
    };

//扩展 ligerGrid 的 搜索功能(高级自定义查询)
$.ligerui.controls.Grid.prototype.showFilter = function () {
    var g = this, p = this.options;
    if (g.winfilter) {
        g.winfilter.show();
        return;
    }
    var filtercontainer = $('<div id="' + g.id + '_filtercontainer"></div>').width(380).height(120).hide();
    var fields = [];
    $(g.columns).each(function () {
        var o = {name: this.name, display: this.display};
        var isNumber = this.type == "int" || this.type == "number" || this.type == "float";
        var isDate = this.type == "date";
        if (isNumber) o.type = "number";
        if (isDate) o.type = "date";
        if (this.editor) {
            o.editor = this.editor;
        }
        fields.push(o);
    });
    var filter = filtercontainer.ligerFilter({fields: fields});
    g.winfilter = $.ligerDialog.open({
        width: 420, height: 208,
        target: filtercontainer, isResize: true, top: 50,
        buttons: [
            {
                text: '确定', onclick: function (item, dialog) {
                loadFilterData();
                dialog.hide();
            }
            },
            {
                text: '取消', onclick: function (item, dialog) {
                dialog.hide();
            }
            }
        ]
    });

    var historyPanle = $('<div class="historypanle"><select class="selhistory"><option value="0">历史查询记录</options></select><input type="button" value="删除" class="deletehistory" /><input type="button" value="保存" class="savehistory" /></div>');
    filtercontainer.append(historyPanle);

    var historySelect = $(".selhistory", historyPanle).change(function () {
        if (this.value == "0") return;
        var rule = getHistoryRule(this.value);
        if (rule)
            filter.setData(rule);
    });

    $(".deletehistory", historyPanle).click(function () {
        if (historySelect.val() == "0") return;
        $.ligerDialog.confirm('确定删除吗', function (yes) {
            if (yes) {
                removeHistory(historySelect.val());
                reLoadHistory();
            }
        });
    });

    $(".savehistory", historyPanle).click(function () {
        $.ligerDialog.prompt('输入保存名字', JSON2.stringify(new Date()).replace(/["-\.:]/g, ''), false, function (yes, name) {
            if (yes && name) {
                addHistory(name);
                reLoadHistory();
                historySelect.val(name);
            }
        });
    });

    reLoadHistory();

    function getKey() {
        return encodeURIComponent(p.url.replace(/(.+)?view=/, ''));
    }

    function reLoadHistory() {
        historySelect.html('<option value="0">历史查询记录</options>');
        var key = getKey();
        var history = LG.cookies.get(key);
        if (history) {
            var data = JSON2.parse(history);
            $(data).each(function () {
                historySelect.append('<option value="' + this.name + '">' + this.name + '</options>');
            });
        }
    }

    function removeHistory(name) {
        var key = getKey();
        var data;
        var history = LG.cookies.get(key);
        if (history) {
            data = JSON2.parse(history);
            for (var i = 0, l = data.length; i < l; i++) {
                if (data[i].name == name) {
                    data.splice(i, 1);
                    LG.cookies.set(key, JSON2.stringify(data));
                    return;
                }
            }
        }
    }

    function addHistory(name) {
        var key = getKey();
        var data;
        var history = LG.cookies.get(key);
        if (history) {
            data = JSON2.parse(history);
            data.push({name: name, value: filter.getData()});

        }
        else {
            data = [{name: name, value: filter.getData()}];
        }
        LG.cookies.set(key, JSON2.stringify(data));
    }

    function getHistoryRule(name) {
        var key = getKey();
        var history = LG.cookies.get(key);
        if (history) {
            var data = JSON2.parse(history);
            for (var i = 0, l = data.length; i < l; i++) {
                if (data[i].name == name)
                    return data[i].value;
            }
        }
        return null;
    }

    function loadFilterData() {
        var data = filter.getData();
        if (data && data.rules && data.rules.length) {
            g.set('parms', {where: JSON2.stringify(data)});
        } else {
            g.set('parms', {});
        }
        g.loadData();
    }
};


/*
 表单 扩展
 */
$.extend($.ligerui.controls.TextBox.prototype, {
    checkNotNull: function () {
        var g = this, p = this.options;
        if (p.nullText && !p.disabled) {
            if (!g.inputText.val()) {
                g.inputText.addClass("l-text-field-null").val(p.nullText);
            }
        }
    }
});

$.extend($.ligerui.controls.ComboBox.prototype, {
    _setHeight: function (value) {
        var g = this;
        if (value > 10) {
            g.wrapper.height(value);
            g.inputText.height(value);
            g.link.height(value);
            g.textwrapper.css({width: value});
        }
    }
});

/**
 * 扩展ligerForm。获得表单的值
 * 可使用attr指定：
 * op:操作，默认为like，
 * type：类型，默认为string
 * data-name：提交字段名，默认为input的name
 * data-ignore ： 是否忽略，默认为false，条件提交到后台，但不一定拼装
 * data-getCVal：下拉框中，获取显示的文本而不是实际的值，默认获取实际的值
 * data-default: 字段默认值,获取默认值
 * date-isrange ： 是否强制取消时间补全
 * data-range ： 是否进行时间补全（start/end）。需要和 data-name 一起使用。
 * N : 补全时间相隔天数，默认是 0
 *
 * 针对时间类型的处理：
 * 1.提交后台VO接收，补全00:00:00对日期无影响
 * 2.提交后台WHERE条件
 *   2.1后台是数据库是date类型
 *      前台提交日期/日期时分秒，后台根据datatype类型使用to_date（oracle）等函数转型比较
 *   2.2前台输入日期，后台是时分秒时使用datetimerage补全时分秒上下边界
 *   2.3通过dateformat控制返回时间字符串的格式，默认是
 *
 * datatype: 针对后台数据库字段类型的处理，适配date数据库类型时请添加 datatype: "date" 属性
 * datetimerange: 补全时间范围，当后台存【日期时分秒】，前台查询只输入【日期】过滤，大于等于补全00:00:00，小于等于补全23:59:59
 * dateformat: 设置日期时分秒值返回格式 yyyy-MM-dd HH:mm:ss
 *
 * defaultSearch={
 * and:[],//直接加入and条件
 * or:[[],[]]，//加入多组or条件
 * }
 *
 * */
$.extend($.ligerui.controls.Form.prototype, {
    getSearchFormData: function (dr, defaultSearch) {
        var g = this, p = this.options;
        var data = {op: "and", rules: [], groups: []};

        var isrange = true,
            rangeObj = {};

        if (dr) {
            data.rules.push({
                field: 'dr', value: 0, op: 'equal', type: 'int'
            });
        }

        //加入默认值
        if(defaultSearch){
            data.rules = data.rules.concat(defaultSearch.and);
            addDefaultOr(data.groups,defaultSearch.or);
        }
        //加入表单的值
        addRules(data.rules);
        rangeObjFun();

        //转换
        return JSON2.stringify(data);

        function addDefaultOr(groups,orArr){
            for(var i = 0,len=orArr.length;i<len;i++){
                groups.push({
                    op: "or",
                    rules:[].concat(orArr[i])
                });
            }
        }

        function addRules(rules) {
            var elems = g.element,
                prefixIDLen = p.prefixID ? p.prefixID.length : 0;

            for (var i = 0, len = elems.length; i < len; i++) {
                var $e = $(elems[i]), name, val, op, type;

                if ($e.parent().hasClass("l-text-combobox")) continue;

                name = $e.attr("name");
                if (!name) continue;
                
                if($e.parent().hasClass("l-text-date")){
                    val = getformatDate($e);
                }
                else if($e.attr("type")==="checkbox"){
                    val = $e[0].checked ? "Y" : "N";
                }
                else{
                    //获取默认值
                    val = $e.val() ||
                            //判断是否attr的取值
                        ($e.prev(".l-text-combobox").length > 0 ?
                            $e.prev(".l-text-combobox").children("input").attr("data-default") : $e.attr("data-default"))
                }


                var $eDataName = $e.attr("data-name");

                if($e.attr("data-range") && isrange){
                    rangeObj[$eDataName] =  rangeObj[$eDataName] ? rangeObj[$eDataName] : {};
                    switch($e.attr("data-range")){
                        case "start":
                            if(!val) {return}
                            rangeObj[$eDataName]['startDom'] = $e;
                            break;
                        case "end":
                            if(!val) {return}
                            rangeObj[$eDataName]['endDom'] = $e;
                            break;
                        case "allStart":
                            rangeObj[$eDataName]['startDom'] = $e;
                            break;
                        case "allEnd":
                            rangeObj[$eDataName]['endDom'] = $e;
                            break;
                    }
                }

                if (!val){
                    continue;
                }else{
                    if($e.attr("date-isrange") == "false"){
                        isrange = false;
                    }
                }

                if ($e.prev(".l-text-combobox").length > 0) {
                    $e = $e.prev(".l-text-combobox").children("input");
                }
                op = $e.attr("op") || "like";
                type = $e.attr("type") || "string";
                
                rules.push({
                    op: op,
                    field: $eDataName || name.slice(prefixIDLen),//去除前缀
                    value: $e.attr("data-getCVal") ? $e.val() : val,
                    type: type,
                    // 增加数据类型，针对日期
                    datatype: $e.attr("datatype") || "",
                    // 增加配置是否忽略
                    ignore :  $e.attr("data-ignore") || false
                });
            }
        }

        //手动获得日期的值
        function getformatDate(ele) {
            var field = ele.attr("ligeruiid");
            var editor = liger.get(field),
                val = editor.getValue() || $(editor.element).val();
            if (!val) return null;
            if (typeof val === "string") {
                if (val.length === 10) val += " 00:00:00";
                val = new Date(val);
                if (val.toString() === "Invalid Date") return null;
            }
            /**
             * 2017-02-20
             * 只传日期，不显示时间的查询条件
             */
            if (ele.attr("datetimerange")) {
            // if (!editor.get('showTime')) {
                //替换小于(等于)的时间
                var op = ele.attr("op") || "like";
                if (op == "lessorequal" || op == "less") {
                    val.setHours(23, 59, 59);
                } else if (op == "greaterorequal" || op == "greater") {
                    val.setHours(0, 0, 0);
                }
            }

            //注意格式
            var format = ele.attr("dateformat") || "yyyy-MM-dd HH:mm:ss";

            return DateUtil.dateToStr(format, val);
        }

        // 自动补全日期
        function autoDate(ele,name,vale,op){
            var dataArray = [];
            if(!vale){
                var valData = new Date(),
                    valData2 = new Date();
                valData2.setDate(valData2.getDate() - (parseInt(ele.attr("N")) || 0));
                valData2.setHours(00,00,00);
                valData.setHours(23,59,59);
                var format = ele.attr("dateformat") || "yyyy-MM-dd HH:mm:ss";
                dataArray.push({
                    datatype:ele.attr("data-datatype") || "",
                    field:name,
                    ignore:ele.attr("data-ignore") || false,
                    op: 'lessorequal',
                    type:"text",
                    value: DateUtil.dateToStr(format,valData)
                });
                dataArray.push({
                    datatype:ele.attr("data-datatype") || "",
                    field:name,
                    ignore:ele.attr("data-ignore") || false,
                    op: 'greaterorequal',
                    type:"text",
                    value: DateUtil.dateToStr(format,valData2)
                });
            }else{
                var format = ele.attr("dateformat") || "yyyy-MM-dd HH:mm:ss";
                if(op == "lessorequal"){
                    vale.setHours(23,59,59);
                }else{
                    vale.setHours(00,00,00);
                }
                dataArray.push({
                    datatype:ele.attr("data-datatype") || "",
                    field:name,
                    ignore:ele.attr("data-ignore") || false,
                    op: op,
                    type:"text",
                    value: DateUtil.dateToStr(format,vale)
                });
            }
            for (var i = dataArray.length - 1;i>=0;i--){
                data.rules.push(dataArray[i]);
            }
        }

        // 进行时间补全
        function rangeObjFun(){
            for(var rangeI in rangeObj){
                var startTure = rangeObj[rangeI].startDom ? rangeObj[rangeI].startDom.val() == "" ? false : true : false;
                var endTure = rangeObj[rangeI].endDom ? rangeObj[rangeI].endDom.val() == "" ? false : true : false;
                if(!startTure){
                    var $e =  rangeObj[rangeI].endDom || rangeObj[rangeI].startDom ,
                        val = $e.val();
                    if(val == ""){
                        autoDate($e,rangeI);
                    }else{
                        var dateSatring = val.split(" ")[0].split("-");
                        var valDate = new Date(dateSatring.join("/"));
                        valDate.setDate(valDate.getDate() - (parseInt($e.attr("N")) || 0) );
                        autoDate($e ,rangeI,valDate,"greaterorequal");
                    }
                }else if(!endTure){
                    var $e =  rangeObj[rangeI].startDom || rangeObj[rangeI].endDom,
                        val = $e.val();
                    if(val == ""){
                        autoDate($e,rangeI);
                    }else {
                        var dateSatring = val.split(" ")[0].split("-");
                        var valDate = new Date(dateSatring.join("/"));
                        valDate.setDate(valDate.getDate() + (parseInt($e.attr("N")) || 0));
                        autoDate($e, rangeI,valDate,  "lessorequal");
                    }
                }else if(!startTure && !endTure){
                    autoDate(rangeObj[rangeI].startDom,rangeI);
                }
            }
        }
    },
    
    //重置表单的值
    reset: function() {
        var g = this, p = this.options;
        var editors = g.editors;
        for (var i in editors) {
            var item = editors[i];
            var editor = item.control;
            if (editor instanceof $.ligerui.controls.TextBox) {
                editor.setValue("");
                $(editors[i].control.element).val("");
            }
            else if (editor instanceof $.ligerui.controls.ComboBox || editor instanceof $.ligerui.controls.DateEditor) {
                if (!$(editor.wrapper).hasClass("l-text-readonly"))
                    editor.clear();
            }
            else if(editor instanceof  $.ligerui.controls.CheckBox){
                editor.setValue("");
            } else {
                editor[0].value = '';
            }
        }
    }
});

$.extend($.ligerui.editors, {
    'set': {
        control: 'Set'
    },
    'taginput': {
        control: 'TagInput'
    }
});

/*
 * 扩展验证
 */
// 日期范围限定，params参数为最小值，最大值和信息提示，是否开启验证，上限的当前时间是否从零点算起，下限的当前时间是否从零点算
jQuery.validator.addMethod("dateRange", function (value, element, params) {
    if (!value || !params[3]) return true;
    var oneDate = 86400000,//一天的毫秒数
        inputDate = DateUtil.strToDate(value + " 00:00:00").getTime(),
        todayDate = new Date(DateUtil.dateToStr("YYYY-MM-DD", new Date()) + " 00:00:00").getTime(),
        currentDate = new Date().getTime(),

        minDate = null,
        maxDate = null;

    if (typeof params[0] === "number") minDate = params[0] * oneDate + (params[5] ? todayDate : currentDate);
    if (typeof params[1] === "number") maxDate = params[1] * oneDate + (params[4] ? todayDate : currentDate);

    return (!minDate || (minDate <= inputDate)) && (!maxDate || (maxDate > inputDate));//maxDate>inputDate，等于的时候实际上是第二天零点了

}, $.validator.format("{2}"));

// 字段比较限定，输入字段和另一个字段比较，params为：比较字段的jq选择器，比较类型（eq,lt,gt,lteq,gteq），信息提示，是否开启验证
jQuery.validator.addMethod("compareNumTo", function (value, element, params) {
    if (!value || !params[3]) return true;

    var elemValue = $(params[0]).val();
    if (!elemValue) return true;

    value = Number(value);
    elemValue = Number(elemValue);

    switch (params[1]) {
        case "eq":
            return value == elemValue;
        case "lteq":
            return value <= elemValue;
        case "gteq":
            return value >= elemValue;
        case "lt":
            return value < elemValue;
        case "gt":
            return value > elemValue;
        default:
            return true;
    }

}, $.validator.format("{2}"));

//判断时间大小比较 ["input[name='']:eq(0)", "gteq", "结束时间必须大于开始时间", true]
jQuery.validator.addMethod("compareDatetimeTo", function (value, element, params) {

    if (!value || !params[3]) return true;

    var elemValue = $(params[0]).val();
    if (!elemValue) return true;

    value = new Date(value.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3"));
    elemValue = new Date(elemValue.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3"));

    switch (params[1]) {
        case "eq":
            return value == elemValue;
        case "lteq":
            return value <= elemValue;
        case "gteq":
            return value >= elemValue;
        case "lt":
            return value < elemValue;
        case "gt":
            return value > elemValue;
        default:
            return true;
    }
}, $.validator.format("{2}"));


//扩展 DateEditor 的updateStyle方法
$.ligerui.controls.DateEditor.prototype.updateStyle = function () {
    var g = this, p = this.options;
    //Grid的date默认格式化函数就有对日期的处理
    var v = $.ligerDefaults.Grid.formatters['date'](g.inputText.val(), {format: p.format});
    g.inputText.val(v);
}


/*
 下拉框 combobox
 */

//下拉框 加载文本值(有的时候在数据库只是返回了id值，并没有加载文本值，需要调用这个方法，远程获取)
$.ligerui.controls.ComboBox.prototype.loadText = function (options) {
    var g = this, p = this.options;
    options = $.extend({
        url: '../handler/select.ashx',
        view: null,
        idfield: null,
        textfield: null
    }, options || {});
    var value = options.value || g.getValue();
    var where = {
        op: 'and', rules: [
            {field: options.idfield, op: 'equal', value: value}
        ]
    };
    $.ajax({
        cache: false,
        async: true,
        dataType: 'json', type: 'post',
        url: options.url,
        data: {
            view: options.view,
            idfield: options.idfield,
            textfield: options.textfield,
            where: JSON2.stringify(where)
        },
        success: function (data) {
            if (!data || !data.length) return;
            g._changeValue(data[0]['id'], data[0]['text']);
        }
    });
};
//使下拉框支持 在弹出窗口在选择
$.ligerui.controls.ComboBox.prototype.openSelect = function (options) {
    var g = this, p = this.options;
    options = $.extend({
        title: '选择数据',     //窗口标题
        width: 800,            //窗口宽度
        height: 420,           //窗口高度
        top: null,
        left: null,
        valueField: null,    //接收表格的value字段名
        textField: null,    //接收表格的text字段名
        grid: null,          //表格的参数 同ligerGrid
        form: null            //搜索表单的参数 同ligerForm
    }, options || {});


    //需要指定表格参数
    if (!options.grid) return;

    //三个 ligerui 对象
    var win, grid, form;

    g.bind('beforeOpen', function () {
        show();
        return false;
    });


    function getGridHeight() {
        if (options.grid.height) return options.grid.height;
        var height = options.height - 60;
        if (options.search) {
            height -= 55;
        }
        return height;
    }

    function show() {
        if (win) {
            win.show();
        }
        else {
            var panle = $("<div></div>");
            var formPanle = $("<form></form>");
            var gridPanle = $("<div></div>");

            panle.append(formPanle).append(gridPanle);

            options.grid.width = options.grid.width || "99%";
            options.grid.height = getGridHeight();

            //grid
            grid = gridPanle.ligerGrid(options.grid);

            grid.bind('dblClickRow', function (rowdata) {
                grid.select(rowdata);
                toSelect();
                win.hide();
            });

            //dialog
            win = $.ligerDialog.open({
                title: options.title,
                width: options.width,
                height: options.height,
                top: options.top,
                left: options.left,
                target: panle,
                buttons: [
                    {
                        text: '选择', onclick: function (item, dialog) {
                        toSelect();
                        dialog.hide();
                    }
                    },
                    {
                        text: '取消', onclick: function (item, dialog) {
                        dialog.hide();
                    }
                    }
                ]
            });
            if (options.search) {
                //搜索
                form = formPanle.ligerForm(options.search);
                //搜索按钮、高级搜索按钮
                var containerBtn1 = $('<li style="margin-right:9px"></li>');
                var containerBtn2 = $('<li></li>');
                $("ul:first", formPanle).append(containerBtn1).append(containerBtn2).after('<div class="l-clear"></div>');

                LG.addSearchButtons(formPanle, grid, containerBtn1, containerBtn2);
            }
            else {
                formPanle.remove();
            }
        }
    }


    function toSelect() {
        var selected = grid.selected;
        var appended = false;
        var ids = "", texts = "";
        $(selected).each(function () {
            if (appended) ids += p.split;

            ids += this[options.valueField];

            texts += this[options.textField];

            appended = true;
        });

        g._changeValue(ids, texts);
    }
};
﻿/*
    文件说明：
        icon选取

    接口方法：
        1，打开窗口方法：f_openIconsWin
        2，保存下拉框ligerui对象：currentComboBox

    例子：
        可以这样使用(选择ICON完了以后，会把icon src保存到下拉框的inputText和valueField)：
        onBeforeOpen: function ()
        {
            currentComboBox = this;
            f_openIconsWin();
            return false;
        }

*/

//图标
var jiconlist, winicons, currentComboBox,grid;
$(function (){
    jiconlist = $("body > .iconlist:first");
    if (!jiconlist.length) jiconlist = $('<ul class="iconlist"></ul>').appendTo('body');
});
 
$(".iconlist li").on({
    'mouseover':function () {
        $(this).addClass("over");
    },
    'mouseout': function () {
        $(this).removeClass("over");
    },
    'click': function (){
        if (!winicons) return;
        var src = $("img", this).attr("src");
        //src = src.replace(/^([\.\/]+)/, '');
        var editingrow = grid.getEditingRow();
        if (editingrow){
            if (currentComboBox){
                currentComboBox.inputText.val(src);
                currentComboBox.valueField.val(src);
            }
        }
        winicons.hide();
    }
});

function f_openIconsWin(){
    if (winicons)
    {
        winicons.show();
        return;
    }
    winicons = $.ligerDialog.open({
        title: '选取图标',
        target: jiconlist,
        width: 470, height: 280, modal: true
    });
    if (!jiconlist.attr("loaded"))    {
        LG.ajax({
            url: '/lg/getIcons.do',
            loading: '正在加载图标中...',
            success: function (data) {
                for (var i = 0, l = data.length; i < l; i++) {
                    var src = data[i];
                    //var reg = /(\\icons)(.+)/;
                    // var match = reg.exec(src);
                    //if (!match) continue;
                    var s = "/icons/32X32/" + src; //match[2].replace(/\\/g, '/');
                    jiconlist.append("<li><img src='" + s + "' /></li>");
                }
                jiconlist.attr("loaded", true);
            }
        });
    }
}
jQuery.extend({
	

    createUploadIframe: function(id, uri)
	{
			//create frame
            var frameId = 'jUploadFrame' + id;
            var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="position:absolute; top:-9999px; left:-9999px"';
			if(window.ActiveXObject)
			{
                if(typeof uri== 'boolean'){
					iframeHtml += ' src="' + 'javascript:false' + '"';

                }
                else if(typeof uri== 'string'){
					iframeHtml += ' src="' + uri + '"';

                }	
			}
			iframeHtml += ' />';
			jQuery(iframeHtml).appendTo(document.body);

            return jQuery('#' + frameId).get(0);			
    },
    createUploadForm: function(id, fileElementId, data)
	{
		//create form	
		var formId = 'jUploadForm' + id;
		var fileId = 'jUploadFile' + id;
		var form = jQuery('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');	
		if(data)
		{
			for(var i in data)
			{
				jQuery('<input type="hidden" name="' + i + '" value="' + data[i] + '" />').appendTo(form);
			}			
		}		
		var oldElement = jQuery('#' + fileElementId);
		var newElement = jQuery(oldElement).clone();
		jQuery(oldElement).attr('id', fileId);
		jQuery(oldElement).before(newElement);
		jQuery(oldElement).appendTo(form);


		
		//set attributes
		jQuery(form).css('position', 'absolute');
		jQuery(form).css('top', '-1200px');
		jQuery(form).css('left', '-1200px');
		jQuery(form).appendTo('body');		
		return form;
    },

    ajaxFileUpload: function(s) {
        // TODO introduce global settings, allowing the client to modify them for all requests, not only timeout		
        s = jQuery.extend({}, jQuery.ajaxSettings, s);
        var id = new Date().getTime()        
		var form = jQuery.createUploadForm(id, s.fileElementId, (typeof(s.data)=='undefined'?false:s.data));
		var io = jQuery.createUploadIframe(id, s.secureuri);
		var frameId = 'jUploadFrame' + id;
		var formId = 'jUploadForm' + id;		
        // Watch for a new set of requests
        if ( s.global && ! jQuery.active++ )
		{
			jQuery.event.trigger( "ajaxStart" );
		}            
        var requestDone = false;
        // Create the request object
        var xml = {}   
        if ( s.global )
            jQuery.event.trigger("ajaxSend", [xml, s]);
        // Wait for a response to come back
        var uploadCallback = function(isTimeout) {
			var io = document.getElementById(frameId);
            try 
			{				
				if(io.contentWindow)
				{
					 xml.responseText = io.contentWindow.document.body?io.contentWindow.document.body.innerHTML:null;
                	 xml.responseXML = io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;
					 
				}else if(io.contentDocument)
				{
					 xml.responseText = io.contentDocument.document.body?io.contentDocument.document.body.innerHTML:null;
                	xml.responseXML = io.contentDocument.document.XMLDocument?io.contentDocument.document.XMLDocument:io.contentDocument.document;
				}						
            }catch(e)
			{
			    console.error(e);
				jQuery.handleError(s, xml, null, e);
			}
            if ( xml || isTimeout == "timeout") 
			{				
                requestDone = true;
                var status;
                try {
                    status = isTimeout != "timeout" ? "success" : "error";
                    // Make sure that the request was successful or notmodified
                    if ( status != "error" )
					{
                        // process the data (runs the xml through httpData regardless of callback)
                        var data = jQuery.uploadHttpData( xml, s.dataType );    
                        // If a local callback was specified, fire it and pass it the data
                        if ( s.success )
                            s.success( data, status );
    
                        // Fire the global callback
                        if( s.global )
                            jQuery.event.trigger( "ajaxSuccess", [xml, s] );
                    } else
                        jQuery.handleError(s, xml, status);
                } catch(e) 
				{
                    console.error(e);
                    status = "error";
                    jQuery.handleError(s, xml, status, e);
                }

                // The request was completed
                if( s.global )
                    jQuery.event.trigger( "ajaxComplete", [xml, s] );

                // Handle the global AJAX counter
                if ( s.global && ! --jQuery.active )
                    jQuery.event.trigger( "ajaxStop" );

                // Process result
                if ( s.complete )
                    s.complete(xml, status);

                jQuery(io).unbind()

                setTimeout(function()
									{	try 
										{
											jQuery(io).remove();
											jQuery(form).remove();	
											
										} catch(e) 
										{
                                            console.error(e);
											jQuery.handleError(s, xml, null, e);
										}									

									}, 100)

                xml = null

            }
        }
        // Timeout checker
        if ( s.timeout > 0 ) 
		{
            setTimeout(function(){
                // Check to see if the request is still happening
                if( !requestDone ) uploadCallback( "timeout" );
            }, s.timeout);
        }
        try 
		{

			var form = jQuery('#' + formId);
			jQuery(form).attr('action', s.url);
			jQuery(form).attr('method', 'POST');
			jQuery(form).attr('target', frameId);
            if(form.encoding)
			{
				jQuery(form).attr('encoding', 'multipart/form-data');      			
            }
            else
			{	
				jQuery(form).attr('enctype', 'multipart/form-data');			
            }			
            jQuery(form).submit();

        } catch(e) 
		{
            console.error(e);
            jQuery.handleError(s, xml, null, e);
        }
		
		jQuery('#' + frameId).load(uploadCallback	);
        return {abort: function () {}};	

    },

    uploadHttpData: function( r, type ) {
        var data = !type;
        data = type == "xml" || data ? r.responseXML : r.responseText;
        // If the type is "script", eval it in global context
        if ( type == "script" )
            jQuery.globalEval( data );
        // Get the JavaScript object, if JSON is used.
        if ( type == "json" )
            eval( "data = " + data );
        // evaluate scripts within html
        if ( type == "html" )
            jQuery("<div>").html(data).evalScripts();

        return data;
    }
})

/**
 * Created by haojc on 2016/1/26.
 *  日期处理工具类
 */
var DateUtil = (function () {

    return {
        /**
         * 直接将字符串转为日期对象
         * */
        createDate:function(str){
            return new Date(str);
        },
        /**
         * 直接将日期对象转换为yyyy-mm-dd
         * @param d 日期对象
         * */
        formatDate:function(d){
            var Y=d.getFullYear(),M=d.getMonth()+1,D=d.getDate();
            return Y+"-"+(M<10?"0"+M:M)+"-"+(D<10?"0"+D:D);
        },
        /**
         * 获得中文星期
         * @param d 日期对象
         * */
        getCNWeekDay:function(d){
            return "日一二三四五六".charAt(d);
        },
        /**
         * 供JSON.stringify使用
         * JSON2.stringify(formData, DateUtil.dateReplacer);
         *
         * @param key
         * @param value
         * @returns {*}
         */
        dateReplacer : function (key, value) {
            return this[key] instanceof Date ? DateUtil.dateToStr('yyyy-MM-dd', this[key]) : value;
        },
        /**
         *
         * @param key
         * @param value
         * @returns {*}
         */
        datetimeReplacer : function (key, value) {
            return this[key] instanceof Date ? DateUtil.dateToStr('yyyy-MM-dd HH:mm:ss', this[key]) : value;
        },
        /**
         * 判断闰年
         * @param date Date日期对象
         * @return boolean true 或false
         */
        isLeapYear : function (date) {
            return (0 == date.getYear() % 4 && ((date.getYear() % 100 != 0) || (date.getYear() % 400 == 0)));
        },
        /**
         * 日期对象转换为指定格式的字符串
         * @param f 日期格式,格式定义如下 yyyy-MM-dd HH:mm:ss
         * @param date Date日期对象, 如果缺省，则为当前时间
         *
         * YYYY/yyyy/YY/yy 表示年份
         * MM/M 月份
         * W/w 星期
         * dd/DD/d/D 日期
         * hh/HH/h/H 时间
         * mm/m 分钟
         * ss/SS/s/S 秒
         * @return string 指定格式的时间字符串
         */
        dateToStr : function (formatStr, date) {
            formatStr = arguments[0] || "yyyy-MM-dd HH:mm:ss";
            date = arguments[1] || new Date();
            var str = formatStr;
            var Week = ['日', '一', '二', '三', '四', '五', '六'];
            str = str.replace(/yyyy|YYYY/, date.getFullYear());
            str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100));
            str = str.replace(/MM/, date.getMonth()+1 > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1));
            str = str.replace(/M/g, date.getMonth()+1);
            str = str.replace(/w|W/g, Week[date.getDay()]);

            str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
            str = str.replace(/d|D/g, date.getDate());

            str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
            str = str.replace(/h|H/g, date.getHours());
            str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
            str = str.replace(/m/g, date.getMinutes());

            str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
            str = str.replace(/s|S/g, date.getSeconds());

            return str;
        },
        /**
         * 日期计算
         * @param strInterval string  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒
         * @param num int
         * @param date Date 日期对象
         * @return Date 返回日期对象
         */
        dateAdd : function (strInterval, num, date) {
            date = arguments[2] || new Date();
            switch (strInterval) {
                case 's': return new Date(date.getTime() + (1000 * num));
                case 'n': return new Date(date.getTime() + (60000 * num));
                case 'h': return new Date(date.getTime() + (3600000 * num));
                case 'd': return new Date(date.getTime() + (86400000 * num));
                case 'w': return new Date(date.getTime() + ((86400000 * 7) * num));
                case 'm': return new Date(date.getFullYear(), (date.getMonth()) + num, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
                case 'y': return new Date((date.getFullYear() + num), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
            }
        },
        /**
         * 比较日期差 dtEnd 格式为日期型或者有效日期格式字符串
         * @param strInterval string  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒
         * @param dtStart Date  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒
         * @param dtEnd Date  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒
         */
        dateDiff : function (strInterval, dtStart, dtEnd) {
            switch (strInterval) {
                case 's': return parseInt((dtEnd - dtStart) / 1000);
                case 'n': return parseInt((dtEnd - dtStart) / 60000);
                case 'h': return parseInt((dtEnd - dtStart) / 3600000);
                case 'd': return parseInt((dtEnd - dtStart) / 86400000);
                case 'w': return parseInt((dtEnd - dtStart) / (86400000 * 7));
                case 'm': return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
                case 'y': return dtEnd.getFullYear() - dtStart.getFullYear();
            }
        },
        /**
         * 字符串转换为日期对象
         * @param date Date 格式为yyyy-MM-dd HH:mm:ss，必须按年月日时分秒的顺序，中间分隔符不限制
         */
        strToDate : function (dateStr) {
            var data = dateStr;
            var reCat = /(\d{1,4})/gm;
            var t = data.match(reCat);
            t[1] = t[1] - 1;
            eval('var d = new Date(' + t.join(',') + ');');
            return d;
        },
        /**
         * 把指定格式的字符串转换为日期对象yyyy-MM-dd HH:mm:ss
         *
         */
        strFormatToDate : function (formatStr, dateStr) {
            var year = 0;
            var start = -1;
            var len = dateStr.length;
            if ((start = formatStr.indexOf('yyyy')) > -1 && start < len) {
                year = dateStr.substr(start, 4);
            }
            var month = 0;
            if ((start = formatStr.indexOf('MM')) > -1 && start < len) {
                month = parseInt(dateStr.substr(start, 2)) - 1;
            }
            var day = 0;
            if ((start = formatStr.indexOf('dd')) > -1 && start < len) {
                day = parseInt(dateStr.substr(start, 2));
            }
            var hour = 0;
            if (((start = formatStr.indexOf('HH')) > -1 || (start = formatStr.indexOf('hh')) > 1) && start < len) {
                hour = parseInt(dateStr.substr(start, 2));
            }
            var minute = 0;
            if ((start = formatStr.indexOf('mm')) > -1 && start < len) {
                minute = dateStr.substr(start, 2);
            }
            var second = 0;
            if ((start = formatStr.indexOf('ss')) > -1 && start < len) {
                second = dateStr.substr(start, 2);
            }
            return new Date(year, month, day, hour, minute, second);
        },
        /**
         * 日期对象转换为毫秒数
         */
        dateToLong : function (date) {
            return date.getTime();
        },
        /**
         * 毫秒转换为日期对象
         * @param dateVal number 日期的毫秒数
         */
        longToDate : function (dateVal) {
            return new Date(dateVal);
        },
        /**
         * 判断字符串是否为日期格式
         * @param str string 字符串
         * @param formatStr string 日期格式， 如下 yyyy-MM-dd
         */
        isDate : function (str, formatStr) {
            if (formatStr == null) {
                formatStr = "yyyyMMdd";
            }
            var yIndex = formatStr.indexOf("yyyy");
            if (yIndex == -1) {
                return false;
            }
            var year = str.substring(yIndex, yIndex + 4);
            var mIndex = formatStr.indexOf("MM");
            if (mIndex == -1) {
                return false;
            }
            var month = str.substring(mIndex, mIndex + 2);
            var dIndex = formatStr.indexOf("dd");
            if (dIndex == -1) {
                return false;
            }
            var day = str.substring(dIndex, dIndex + 2);
            if (!isNumber(year) || year > "2100" || year < "1900") {
                return false;
            }
            if (!isNumber(month) || month > "12" || month < "01") {
                return false;
            }
            if (day > getMaxDay(year, month) || day < "01") {
                return false;
            }
            return true;
        },
        getMaxDay : function (year, month) {
            if (month == 4 || month == 6 || month == 9 || month == 11)
                return "30";
            if (month == 2)
                if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0)
                    return "29";
                else
                    return "28";
            return "31";
        },
        /**
         *    变量是否为数字
         */
        isNumber : function (str) {
            var regExp = /^\d+$/g;
            return regExp.test(str);
        },
        /**
         * 把日期分割成数组 [年、月、日、时、分、秒]
         */
        toArray : function (myDate) {
            myDate = arguments[0] || new Date();
            var myArray = Array();
            myArray[0] = myDate.getFullYear();
            myArray[1] = myDate.getMonth();
            myArray[2] = myDate.getDate();
            myArray[3] = myDate.getHours();
            myArray[4] = myDate.getMinutes();
            myArray[5] = myDate.getSeconds();
            return myArray;
        },
        /**
         * 取得日期数据信息
         * 参数 interval 表示数据类型
         * y 年 M月 d日 w星期 ww周 h时 n分 s秒
         */
        datePart : function (interval, myDate) {
            myDate = arguments[1] || new Date();
            var partStr = '';
            var Week = ['日', '一', '二', '三', '四', '五', '六'];
            switch (interval) {
                case 'y': partStr = myDate.getFullYear(); break;
                case 'M': partStr = myDate.getMonth() + 1; break;
                case 'd': partStr = myDate.getDate(); break;
                case 'w': partStr = Week[myDate.getDay()]; break;
                case 'ww': partStr = myDate.WeekNumOfYear(); break;
                case 'h': partStr = myDate.getHours(); break;
                case 'm': partStr = myDate.getMinutes(); break;
                case 's': partStr = myDate.getSeconds(); break;
            }
            return partStr;
        },
        /**
         * 取得当前日期所在月的最大天数
         */
        maxDayOfDate : function (date) {
            date = arguments[0] || new Date();
            date.setDate(1);
            date.setMonth(date.getMonth() + 1);
            var time = date.getTime() - 24 * 60 * 60 * 1000;
            var newDate = new Date(time);
            return newDate.getDate();
        }
    };
})();
/*
 * 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
 * @param fn {function}  需要调用的函数
 * @param delay  {number}    延迟时间，单位毫秒
 * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
 * @return {function}实际调用函数
 */
var throttle = function (fn, delay, immediate, debounce) {
    var curr = +new Date(),//当前事件
        last_call = 0,
        last_exec = 0,
        timer = null,
        diff, //时间差
        context,//上下文
        args,
        exec = function () {
            last_exec = curr;
            fn.apply(context, args);
        };
    return function () {
        curr = +new Date();
        context = this,
            args = arguments,
            diff = curr - (debounce ? last_call : last_exec) - delay;
        clearTimeout(timer);
        if (debounce) {
            if (immediate) {
                timer = setTimeout(exec, delay);
            } else if (diff >= 0) {
                exec();
            }
        } else {
            if (diff >= 0) {
                exec();
            } else if (immediate) {
                timer = setTimeout(exec, -diff);
            }
        }
        last_call = curr;
    }
};

/*
 * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
 * @param fn {function}  要调用的函数
 * @param delay   {number}    空闲时间
 * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
 * @return {function}实际调用函数
 */

var debounce = function (fn, delay, immediate) {
    return throttle(fn, delay, immediate, true);
};

//节流函数
// var debounceLoad = debounce(loadLog, 500, true);

﻿//获取QueryString的数组
function getQueryString()
{
    var result = location.search.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+", "g"));
    if (result == null)
    {
        return "";
    }
    for (var i = 0; i < result.length; i++)
    {
        result[i] = result[i].substring(1);
    }
    return result;
}
//根据QueryString参数名称获取值
function getQueryStringByName(name)
{
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1)
    {
        return "";
    }
    return result[1];
}
//根据QueryString参数索引获取值
function getQueryStringByIndex(index)
{
    if (index == null)
    {
        return "";
    }
    var queryStringList = getQueryString();
    if (index >= queryStringList.length)
    {
        return "";
    }
    var result = queryStringList[index];
    var startIndex = result.indexOf("=") + 1;
    result = result.substring(startIndex);
    return result;
}

(function ($)
{

    //全局事件
    $(".l-dialog-btn").on('mouseover', function ()
    {
        $(this).addClass("l-dialog-btn-over");
    }).on('mouseout', function ()
    {
        $(this).removeClass("l-dialog-btn-over");
    });
    $(".l-dialog-tc .l-dialog-close").on('mouseover', function ()
    {
        $(this).addClass("l-dialog-close-over");
    }).on('mouseout', function ()
    {
        $(this).removeClass("l-dialog-close-over");
    });
    //搜索框 收缩/展开
    $(".searchtitle .togglebtn").on('click',function(){
        if($(this).hasClass("togglebtn-down")) $(this).removeClass("togglebtn-down");
        else $(this).addClass("togglebtn-down");
        var searchbox = $(this).parent().nextAll("div.searchbox:first");
        searchbox.slideToggle('fast');
    });

    $(document).keydown(function (e) {
        var doPrevent;
        if (e.keyCode == 8) {
            var d = e.srcElement || e.target;
            if (d.tagName.toUpperCase() == 'INPUT' || d.tagName.toUpperCase() == 'TEXTAREA') {
                doPrevent = d.readOnly || d.disabled;
            }
            else
                doPrevent = true;
        }
        else
            doPrevent = false;

        if (doPrevent)
            e.preventDefault();
    });

})(jQuery);

$(function newCommon() {
    //input粘贴事件，去掉首尾空白字符
    $("body").on("paste","input[type=text]",function (e) {
        e.preventDefault();
        var text = null,textRange,sel;

        if(window.clipboardData && clipboardData.setData) {
            // IE
            text = window.clipboardData.getData('text');
        } else {
            text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('在这里输入文本');
        }
        
        //去掉首尾空格
        text = $.trim(text);

        if (document.body.createTextRange) {
            if (document.selection) {
                textRange = document.selection.createRange();
            } else if (window.getSelection) {
                sel = window.getSelection();
                var range = sel.getRangeAt(0);

                // 创建临时元素，使得TextRange可以移动到正确的位置
                var tempEl = document.createElement("span");
                tempEl.innerHTML = "&#FEFF;";
                range.deleteContents();
                range.insertNode(tempEl);
                textRange = document.body.createTextRange();
                textRange.moveToElementText(tempEl);
                tempEl.parentNode.removeChild(tempEl);
            }
            textRange.text = text;
            textRange.collapse(false);
            textRange.select();
        } else {
            // Chrome之类浏览器
            document.execCommand("insertText", false, text);
        }
    });

    //动画效果
    (function addAnimate() {
        var fun = window.onload;
        window.onload = function () {
            if (typeof fun === "function") {
                fun();
            }
            if(parent !== top) {
                $("body").addClass("in-iframe");
                return;
            }
            if(getQueryStringByName("ani")==="no"){
                return;
            }
            if (Math.round(Math.random()) & 1) {
                if ($(".l-container").addClass("animation appearRTL").length <= 0) {
                    $("body").addClass("animation appearRTL");
                }
            }
            else {
                if ($(".l-container").addClass("animation appearBTT").length <= 0) {
                    $("body").addClass("animation appearBTT");
                }
            }
        }
    })();

    //placeholder修复
    (function fixedPlaceHolder() {
        var $inputArr = $("input[placeholder]");
        //当没有input或者input支持placeholder时退出
        if ($inputArr.length <= 0 || "placeholder" in $inputArr[0]) return;
        //添加元素到dom
        $inputArr.each(function () {
            var $this = $(this);
            $this.after('<span class="placeholder" style="position: absolute;">' + $this.attr("placeholder") + '</span>');
        });
        //事件监听
        $("body").on("click", ".placeholder", function () {
            var $this = $(this);
            $this.hide().siblings("input").focus();
        });
        $inputArr.on({
            "focus":function(){
                $(this).siblings(".placeholder").hide();
            },
            "blur":function () {
                var $this = $(this);
                if (!$this.val()) {
                    $this.siblings(".placeholder").show();
                }
            }
        });
    })();

    //隐藏式搜索框状态控制
    (function hiddenSearchCtrl(){
        var $hiddenSearch=$(".hidden-search");
        $hiddenSearch.on("click",function () {
            if($(this).hasClass("hover")) return;
            $(this).addClass("hover")
        });
        $hiddenSearch.find(".cancel").on("click",function(e){
            $(this).parents(".hidden-search").removeClass("hover");
            e.stopPropagation();
        });
    })();

    //单框搜索事件
    $("body").on("click","[data-action='single-search']",function(e){
        $("body").trigger("single-search",[$(this).siblings("[data-action='single-search-input']:eq(0)").val(),this,e]);
    });
    $("body").on("keypress","[data-action='single-search-input']",function(e){
        if(e.keyCode == 13){
            $("body").trigger("single-search",[$(this).val(),this,e]);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });
    //单框搜索清除按钮
    $(".search-box .input-box").add(".hidden-search").find(".clear").on("click",function () {
        $(this).siblings("input").val("");
    });

    //返回上一级
    $("body").on("click","[data-action='select-menu']",backtrackFun);
    
    //垂直列表组件
    window.verticalList=(function verticalList(){

        setStatus();
        
        var resize=debounce( setStatus, 200, true);

        $(window).resize(function () {
            resize();
        });

        //事件监听
        $("body").on("click","[data-action='vertical-list-slide']",function(){
            var $this=$(this);
            //按钮被禁用
            if($this.hasClass("disabled")) return;

            var $listWrap=$this.siblings(".vertical-list"),
                $list=$listWrap.children("ul:eq(0)"),
                maxTop=$list.height()-$listWrap.height(),
                itemHeight=$list.children("li:eq(1)").outerHeight(true) || 200,
                currentTop=$list.position().top,
                $up,
                $down;

            if(!maxTop) return;

            if($this.hasClass("up")){
                currentTop+=itemHeight*1;
                $up=$this;
                $down=$up.siblings(".down[data-action='vertical-list-slide']");
            }
            else if($this.hasClass("down")){
                currentTop-=itemHeight*1;
                $down=$this;
                $up=$down.siblings(".up[data-action='vertical-list-slide']");
            }
            $list.animate({top:currentTop + "px"},300);
            setTimeout(function(){
                var top=currentTop;
                if(currentTop>0 || maxTop<0){
                    top=0;
                }
                else if(currentTop+maxTop<=0){
                    top=-maxTop;
                }
                if(top !== currentTop){
                    $list.stop();
                    $list.animate({top:top+"px"},200);
                }
                //更新状态
                _setStatus($up,$down,top,maxTop);
            },200);
        });

        //暴露方法
        return {
            setStatus:setStatus
        };

        function _setStatus($up,$down,currentTop,maxTop){
            if(currentTop>=0){
                $up.addClass("disabled");
            }
            else{
                $up.removeClass("disabled");
            }
            if(currentTop+maxTop<=0){
                $down.addClass("disabled");
            }
            else{
                $down.removeClass("disabled");
            }
        }

        //设置按钮状态
        function setStatus(){
            $(".up[data-action='vertical-list-slide']").each(function(){
                var $up=$(this),
                    $listWrap=$up.siblings(".vertical-list"),
                    $list=$listWrap.children("ul"),
                    maxTop=$list.height()-$listWrap.height(),
                    currentTop=$list.position().top;
                var $down=$up.siblings(".down[data-action='vertical-list-slide']");
                _setStatus($up,$down,currentTop,maxTop);
            });
        }
    })();

    //高级搜索框控制
    (function advancedSearch(){
        $("body").on("click",'[data-action="open-advanced-search"]',function () {
            $("#advanced-search-wrap").removeClass("ani-hide").addClass("active ani-show");
        });
        $("body").on("click",'[data-action="close-advanced-search"]',function () {
            $("#advanced-search-wrap").removeClass("ani-show").addClass("ani-hide");
            $("#advanced-btn>.text").addClass("ani");
            if("animation" in document.body.style){
                setTimeout(function(){
                    $("#advanced-search-wrap").removeClass("ani-hide active");
                    $("#advanced-btn>.text").removeClass("ani");
                },500);
            }
            else{
                $("#advanced-search-wrap").removeClass("ani-hide active");
                $("#advanced-btn>.text").removeClass("ani");
            }
        });
    })();

});
//根据url选择左侧菜单
//需要获得fromtab(url中获得)
function backtrackFun(){
    var testEq = /urlid=([^&]*)/.exec(window.location.search);
    if (testEq) {
        try {
            top.tab.removeTabItem(top.tab.getSelectedTabItemID()).selectTabItem(testEq[1]);
        }
        catch (e) {
            console.error(e);
        }
    }
    else {
        top.topBackTrack.back();
    }
}
// 获取屏幕缩放比例
function detectZoom (windowX) {
    var ratio = 0;
    windowX = windowX || window;
    if (windowX.outerWidth !== undefined && windowX.innerWidth !== undefined) {
        ratio = windowX.outerWidth / windowX.innerWidth;
    }
    return parseFloat(ratio.toString().replace(/([0-9]+\.[0-9]{2})[0-9]*/,"$1"));
};﻿/**
 * jQuery ligerUI 1.3.2
 *
 * http://ligerui.com
 *
 * Author zph 2016
 *
 */
(function ($) {

    $.fn.ligerSearchForm = function (options) {
        return $.ligerui.run.call(this, "ligerSearchForm", arguments);
    };

    $.fn.ligerGetSearchFormManager = function () {
        return $.ligerui.run.call(this, "ligerGetSearchFormManager", arguments);
    };

    $.ligerDefaults.SearchForm = {};

    $.ligerMethos.SearchForm = {};

    $.ligerui.controls.SearchForm = function (element, options) {
        $.ligerui.controls.SearchForm.base.constructor.call(this, element, options);
    };
    $.ligerui.controls.SearchForm.ligerExtend($.ligerui.core.UIComponent, {
        __getType: function () {
            return 'SearchForm';
        },
        __idPrev: function () {
            return 'SearchForm';
        },
        _extendMethods: function () {
            return $.ligerMethos.SearchForm;
        },
        _render: function () {
            var g = this, p = this.options;
            g.searchFormEle = $(this.element);
            g.set(p);

            //初始化表单
            g.searchForm = g.searchFormEle.ligerForm(p);

            //绑定表单组件ID
            p.searchBind = $.extend({}, {
                //搜索框绑定信息
                searchBtnId: "searchBtn",
                searchBtnText: "查询",
                resetBtnId: "resetBtn",
                resetBtnText: "重置",
                bindGridId: "mainGrid",
                defaultFilter: {and:[],or:[]},
                dr: false,
                onAfterSearch:null,
                where: null
            }, p.searchBind);

            g.searchBind = p.searchBind;
            g.mainGridId = p.searchBind.bindGridId;
            g.searchBtnEle = $('#' + p.searchBind.searchBtnId);
            g.resetBtnEle = $('#' + p.searchBind.resetBtnId);

            g.searchBtn = createButton({
                appendTo: g.searchBtnEle,
                width: 80,
                text: p.searchBind.searchBtnText,
                click: function () {
                    //判断是否有其他操作
                    if (g.searchForm.valid()) {
                        //判断是否生成历史查询
                        if(p.historySearch && p.historySearch.formId){
                            g._createHistoryForm(g.searchForm.getData(), true);
                        }
                        //设置表格参数，搜索表格
                        if(g.mainGridId){
                            var mainGrid = liger.get(g.mainGridId),
                                where = null;
                            if (g.searchBind.where) {
                                where = typeof g.searchBind.where === 'function' ? g.searchBind.where.call(g, p, g.searchForm) : g.searchBind.where;
                            } else {
                                where = g.searchForm.getSearchFormData(g.searchBind.dr, g.searchBind.defaultFilter)
                            }
                            //表格查询
                            mainGrid.set('parms', [{name: 'where', value: where}]);
                            mainGrid.changePage('first');
                            mainGrid.loadData();
                        }
                        //触发查询后事件
                        typeof p.searchBind.onAfterSearch === "function" &&  p.searchBind.onAfterSearch.call(this, p);
                    }
                    else {
                        g.searchForm.showInvalid();
                    }
                }
            });

            g.resetBtn = createButton({
                appendTo: g.resetBtnEle,
                width: 80,
                text: p.searchBind.resetBtnText,
                click: function () {
                    g.searchForm.reset();
                    g.mainGridId && liger.get(g.mainGridId).set('parms', [{name: 'where', value: g.searchForm.getSearchFormData(true)}])
                }
            });

            //根据id初始化历史搜索表单
            p.historySearch && g._loadDataFormStorage(p.historySearch.storageId);

            function createButton(options) {
                var p = $.extend({
                    appendTo: $('body')
                }, options || {});
                var btn = $('<div class="" style="width:60px"><span></span></div>');
                if (p.icon) {
                    btn.removeClass("buttonnoicon");
                    btn.append('<div class="button-icon"> <img src="' + p.icon + '" /> </div> ');
                }
                //绿色皮肤
                if (p.green) {
                    btn.removeClass("button2");
                }
                if (p.width) {
                    btn.width(p.width);
                }
                if (p.click) {
                    btn.click(p.click);
                }
                if (p.text) {
                    $("span", btn).html(p.text);
                }
                if (typeof (p.appendTo) == "string") p.appendTo = $(p.appendTo);
                btn.appendTo(p.appendTo);
                return btn;
            }

        },
        _loadDataFormStorage: function (storageId) {
            var g = this, p = this.options;
            var data;
            if(storageId && localStorage){
                data = localStorage.getItem(storageId);
                if(data) {
                    g._currentSearchData = JSON2.parse(data);
                }
            }
            //没有对象存储，使用默认值
            if(!g._currentSearchData) g._currentSearchData = p.historySearch.defaultFields;
            g._currentSearchData && g._createHistoryForm($.extend(true,{},g._currentSearchData), false);
        },
        _saveDataToStorage: function (storageId,data) {
            if(storageId && localStorage){
                localStorage.setItem(storageId,JSON2.stringify(data));   
            }
        },
        _deleteDataFormStorage: function (storageId, name) {
            var data;
            if(storageId && localStorage){
                data = localStorage.getItem(storageId);
                if(data){
                    data = JSON2.parse(data);
                    delete data[name];
                    localStorage.setItem(storageId,JSON2.stringify(data));
                }
            }
        },
        //创建历史搜索表单
        _createHistoryForm: function (searchData,setData) {
            var g = this, p = this.options;
            if(g.historyForm){
                var historyForm = g.historyForm;
                //销毁已有的表单
                liger.remove(historyForm);
                for (var index in historyForm.editors)
                {
                    var control = historyForm.editors[index].control;
                    if (control && control.destroy) control.destroy();
                }
                $(historyForm.element).html("").removeAttr("ligeruiid").removeClass("l-form");
            }
            else{
                g._initHistoryForm();
            }
            //默认配置
            p.historySearch.options.prefixID = p.historySearch.options.prefixID || "hs_";
            //生成表单
            var historyFormOptions = p.historySearch.options;
            historyFormOptions.fields = g._getHistoryFields(searchData);
            //暴露出historyForm
            g.searchForm.historyForm = g.historyForm = $("#" + p.historySearch.formId).ligerForm(historyFormOptions);
            if(setData) g.historyForm.setData(searchData );
            //保存记录
            g._saveDataToStorage(p.historySearch.storageId, g._currentSearchData);
        },
        //首次创建历史搜索表单
        _initHistoryForm: function () {
            var g = this, p = this.options;
            //首次创建，绑定事件
            $("#" + p.historySearch.formId).on("click",".l-history-close",function () {
                var $this = $(this),
                    fieldName = $this.attr("data-name");
                g._hideHistoryField(fieldName,$this.parent().parent().find("input[ligeruiid]:eq(0)").attr("ligeruiid"));
                //从storage里移除
                g._deleteDataFormStorage(p.historySearch.storageId, fieldName);
                delete g._currentSearchData[fieldName];
            });
            //暴露出historySearch方法
            g.searchForm.historySearch = function () {
                var filterForm = this;
                if(filterForm && filterForm.historyForm){
                    //搜索表格
                    if(g.mainGridId){
                        var mainGrid = liger.get(g.mainGridId),
                            where = null;
                        if (g.searchBind.where) {
                            where = typeof g.searchBind.where === 'function' ? g.searchBind.where.call(g, p, g.historyForm) : g.searchBind.where;
                        } else {
                            where = g.historyForm.getSearchFormData(g.searchBind.dr, g.searchBind.defaultFilter)
                        }
                        //表格查询
                        mainGrid.set('parms', [{name: 'where', value: where}]);
                        mainGrid.changePage('first');
                        mainGrid.loadData();
                    }
                    //重置高级搜索表单
                    var searchData = g.historyForm.getData();
                    filterForm.reset();
                    filterForm.setData(searchData);
                }
            }
            //若指定btnid，则绑定事件
            var btnId = p.historySearch.searchBtnId;
            if(btnId){
                $("#" + btnId).on("click",function () {
                    g.searchForm && g.searchForm.historySearch();
                });
            }
        },
        //隐藏已生成的字段，供historyForm使用
        _hideHistoryField: function (fieldName,ligeruiid) {
            var g = this, p = this.options;
            var m = liger.get(ligeruiid);
            if(m){
                if(m.clear) m.clear();
                else if(m.setValue) m.setValue("");
            }
            g.historyForm.setVisible(fieldName, false);
        },
        //通过键值对获得已使用的字段
        _getHistoryFields: function (data) {
            var g = this, p = this.options;
            var fields = [], initFields = g._initFields;

            if(!g._currentSearchData) g._currentSearchData =  {};

            if(!initFields){
                initFields = g._initFields = g._getInitFields(p.fields);
            }

            data = $.extend(true, {}, data, g._currentSearchData);

            for(var name in data){
                if(data[name] || typeof data[name] === "number"){
                    if(initFields[name]){
                        fields.push(initFields[name]);
                        //增加字段到g._currentSearchData
                        g._currentSearchData[name] = true;
                    }
                }
            }

            return fields;
        },
        //将数组形式的字段配置转为对象形式的配置
        _getInitFields: function (fields) {
            var g = this, p = this.options;
            var fieldsObj = {},
                wordWidth = p.historySearch.wordWidth,
                labelWidthDiff = p.historySearch.fieldWidthDiff || 0,
                exFileds = p.historySearch.exFields || {},
                field;
            
            fields = $.extend(true, [], fields);
            
            for(var i = 0, len = fields.length; i < len; i++){
                field = fields[i];
                if(field.name){
                    fieldsObj[field.name] = field;
                    //加上关闭按钮
                    if(!field.afterContent){
                        field.afterContent = '<li class="l-close"><a href="javascript:;" class="l-history-close" data-name="'+ field.name +'">&times;</a></li>';
                    }
                    //定义了wordWidth，覆盖之前的labelWidth
                    if(wordWidth && field.display){
                        field.labelWidth = field.display.length * wordWidth + labelWidthDiff;
                    }
                    //最后加上自定义的属性
                    fields[i] = $.extend(true, field, exFileds[field.name])
                }
            }
            
            return fieldsObj;
        }
    });
    
    //旧写法保留
    $.ligerui.controls.SearchForm.prototype.setEnable = $.ligerui.controls.SearchForm.prototype.setEnabled;
    $.ligerui.controls.SearchForm.prototype.setDisable = $.ligerui.controls.SearchForm.prototype.setDisabled;
})(jQuery);/*!art-template - Template Engine | http://aui.github.com/artTemplate/*/
!function(){function a(a){return a.replace(t,"").replace(u,",").replace(v,"").replace(w,"").replace(x,"").split(y)}function b(a){return"'"+a.replace(/('|\\)/g,"\\$1").replace(/\r/g,"\\r").replace(/\n/g,"\\n")+"'"}function c(c,d){function e(a){return m+=a.split(/\n/).length-1,k&&(a=a.replace(/\s+/g," ").replace(/<!--[\w\W]*?-->/g,"")),a&&(a=s[1]+b(a)+s[2]+"\n"),a}function f(b){var c=m;if(j?b=j(b,d):g&&(b=b.replace(/\n/g,function(){return m++,"$line="+m+";"})),0===b.indexOf("=")){var e=l&&!/^=[=#]/.test(b);if(b=b.replace(/^=[=#]?|[\s;]*$/g,""),e){var f=b.replace(/\s*\([^\)]+\)/,"");n[f]||/^(include|print)$/.test(f)||(b="$escape("+b+")")}else b="$string("+b+")";b=s[1]+b+s[2]}return g&&(b="$line="+c+";"+b),r(a(b),function(a){if(a&&!p[a]){var b;b="print"===a?u:"include"===a?v:n[a]?"$utils."+a:o[a]?"$helpers."+a:"$data."+a,w+=a+"="+b+",",p[a]=!0}}),b+"\n"}var g=d.debug,h=d.openTag,i=d.closeTag,j=d.parser,k=d.compress,l=d.escape,m=1,p={$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1},q="".trim,s=q?["$out='';","$out+=",";","$out"]:["$out=[];","$out.push(",");","$out.join('')"],t=q?"$out+=text;return $out;":"$out.push(text);",u="function(){var text=''.concat.apply('',arguments);"+t+"}",v="function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);"+t+"}",w="'use strict';var $utils=this,$helpers=$utils.$helpers,"+(g?"$line=0,":""),x=s[0],y="return new String("+s[3]+");";r(c.split(h),function(a){a=a.split(i);var b=a[0],c=a[1];1===a.length?x+=e(b):(x+=f(b),c&&(x+=e(c)))});var z=w+x+y;g&&(z="try{"+z+"}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:"+b(c)+".split(/\\n/)[$line-1].replace(/^\\s+/,'')};}");try{var A=new Function("$data","$filename",z);return A.prototype=n,A}catch(B){throw B.temp="function anonymous($data,$filename) {"+z+"}",B}}var d=function(a,b){return"string"==typeof b?q(b,{filename:a}):g(a,b)};d.version="3.0.0",d.config=function(a,b){e[a]=b};var e=d.defaults={openTag:"<%",closeTag:"%>",escape:!0,cache:!0,compress:!1,parser:null},f=d.cache={};d.render=function(a,b){return q(a,b)};var g=d.renderFile=function(a,b){var c=d.get(a)||p({filename:a,name:"Render Error",message:"Template not found"});return b?c(b):c};d.get=function(a){var b;if(f[a])b=f[a];else if("object"==typeof document){var c=document.getElementById(a);if(c){var d=(c.value||c.innerHTML).replace(/^\s*|\s*$/g,"");b=q(d,{filename:a})}}return b};var h=function(a,b){return"string"!=typeof a&&(b=typeof a,"number"===b?a+="":a="function"===b?h(a.call(a)):""),a},i={"<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","&":"&#38;"},j=function(a){return i[a]},k=function(a){return h(a).replace(/&(?![\w#]+;)|[<>"']/g,j)},l=Array.isArray||function(a){return"[object Array]"==={}.toString.call(a)},m=function(a,b){var c,d;if(l(a))for(c=0,d=a.length;d>c;c++)b.call(a,a[c],c,a);else for(c in a)b.call(a,a[c],c)},n=d.utils={$helpers:{},$include:g,$string:h,$escape:k,$each:m};d.helper=function(a,b){o[a]=b};var o=d.helpers=n.$helpers;d.onerror=function(a){var b="Template Error\n\n";for(var c in a)b+="<"+c+">\n"+a[c]+"\n\n";"object"==typeof console&&console.error(b)};var p=function(a){return d.onerror(a),function(){return"{Template Error}"}},q=d.compile=function(a,b){function d(c){try{return new i(c,h)+""}catch(d){return b.debug?p(d)():(b.debug=!0,q(a,b)(c))}}b=b||{};for(var g in e)void 0===b[g]&&(b[g]=e[g]);var h=b.filename;try{var i=c(a,b)}catch(j){return j.filename=h||"anonymous",j.name="Syntax Error",p(j)}return d.prototype=i.prototype,d.toString=function(){return i.toString()},h&&b.cache&&(f[h]=d),d},r=n.$each,s="break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",t=/\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g,u=/[^\w$]+/g,v=new RegExp(["\\b"+s.replace(/,/g,"\\b|\\b")+"\\b"].join("|"),"g"),w=/^\d[^,]*|,\d[^,]*/g,x=/^,+|,+$/g,y=/^$|,+/;e.openTag="{{",e.closeTag="}}";var z=function(a,b){var c=b.split(":"),d=c.shift(),e=c.join(":")||"";return e&&(e=", "+e),"$helpers."+d+"("+a+e+")"};e.parser=function(a){a=a.replace(/^\s/,"");var b=a.split(" "),c=b.shift(),e=b.join(" ");switch(c){case"if":a="if("+e+"){";break;case"else":b="if"===b.shift()?" if("+b.join(" ")+")":"",a="}else"+b+"{";break;case"/if":a="}";break;case"each":var f=b[0]||"$data",g=b[1]||"as",h=b[2]||"$value",i=b[3]||"$index",j=h+","+i;"as"!==g&&(f="[]"),a="$each("+f+",function("+j+"){";break;case"/each":a="});";break;case"echo":a="print("+e+");";break;case"print":case"include":a=c+"("+b.join(",")+");";break;default:if(/^\s*\|\s*[\w\$]/.test(e)){var k=!0;0===a.indexOf("#")&&(a=a.substr(1),k=!1);for(var l=0,m=a.split("|"),n=m.length,o=m[l++];n>l;l++)o=z(o,m[l]);a=(k?"=":"=#")+o}else a=d.helpers[c]?"=#"+c+"("+b.join(",")+");":"="+a}return a},"function"==typeof define?define(function(){return d}):"undefined"!=typeof exports?module.exports=d:this.template=d}();/**
 * 集装箱相关
 * @type {{verifyContainerCode}}
 */
var cntrUtil = (function () {
    return {
        //校验柜号是否正确
        verifyContainerCode: function (strCode) {
            var Charcode = "0123456789A?BCDEFGHIJK?LMNOPQRSTU?VWXYZ";
            if (strCode.length != 11) return false;
            var result = true;
            var num = 0;
            for (var i = 0; i < 10; i++) {
                var idx = Charcode.indexOf(strCode[i]);
                if (idx == -1 || Charcode[idx] == '?') {
                    result = false;
                    break;
                }
                idx = idx * Math.pow(2, i);
                num += idx;
            }
            num = (num % 11) % 10;
            return parseInt(strCode[10]) == num;
        }
    }
})();/**
 * 从数据字典获取价格树
 * @type {{verifyContainerCode}}
 */
var priceBaseUtil = (function () {
    return {
        //校验柜号是否正确
        processPriceBase: function (data_dict) {
            //获取计量单位联动map
            var remap_price_base = {};

            //计价基准:获取计量单位
            var data_price_base = $.grep(data_dict.price_base, function (item) {
                return !item.pdictmx_code;
            });

            //计价单位
            var array_price_unit = $.grep(data_dict.price_base, function (item) {
                return !!item.pdictmx_code;
            });
            for (var i = 0; i < data_price_base.length; i++) {
                var base = data_price_base[i];
                remap_price_base[base.id] = base;
                base.unitMap = {};
                base.unitList = $.grep(array_price_unit, function (item) {
                    var flag = item.pdictmx_code === base.id;
                    if (flag) {
                        base.unitMap[item.id] = item;
                    }
                    return flag;
                });
            }

            return {
                'remap': remap_price_base,
                'base': data_price_base
            };
        },
        processCargoUnit: function (remap_price_base) {
            var cargo_unit = [];
            var unit_type = [ 'BASE_WEIGHT','BASE_QTY','BASE_VOLUME' ];

            for (var i = 0; i < unit_type.length; i++) {
                var type = remap_price_base[unit_type[i]];
                if (!!type) {
                    cargo_unit = cargo_unit.concat(type.unitList || []);
                }
            }
            return cargo_unit;
        }
    }
})();var xlsUtil = (function () {
    return {

        /**
         * EXCEL导出工具
         * @param $form 临时表单
         * @param mainGrid ligerGrid的配置
         * @param filename 导出文件名
         * @param data 自定义字段
         * @param headers 自定义表头字段
         * @param names 自定义表头名称
         */
        exp: function($form, mainGrid, filename, data, headers, names, sortorder, sortname) {

            var options = mainGrid.options;
            var columns = mainGrid.options.columns;

            var footers = [];
            if (!headers) {

                headers = [];
                names = [];


                for (var i in columns) {
                    var column = columns[i];

                    //忽略
                    var ignore = column.xlsIgnore || false;

                    if (!ignore) {
                        var xlsHead = column.xlsHead || column.display;
                        var xlsName = column.xlsName || column.name;

                        if (xlsHead && xlsName) {
                            headers.push(xlsHead);
                            names.push(xlsName);
                            //表尾合计
                            var xlsFooter = !!column.totalSummary;
                            footers.push(xlsFooter ? 'SUM' : '#');
                        }
                    }
                }

                headers = headers.join(",");
                names = names.join(",");
                footers = footers.join(",");

            }

            //自定义
            if (data) {
                for (var key in data) {
                    $form.find('input[name=' + key + ']').val(data[key]);
                }
            }

            $form.find('input[name=file_name]').val(filename);
            $form.find('input[name=headers]').val(headers);
            $form.find('input[name=names]').val(names);
            $form.find('input[name=footers]').val(footers);
            $form.find('input[name=sortname]').val(sortorder);
            $form.find('input[name=sortorder]').val(sortname);

            $form.submit();
        }
    }
})();var GPS = {
    PI : 3.14159265358979324,
    x_pi : 3.14159265358979324 * 3000.0 / 180.0,
    delta : function (lat, lon) {
        // Krasovsky 1940
        //
        // a = 6378245.0, 1/f = 298.3
        // b = a * (1 - f)
        // ee = (a^2 - b^2) / a^2;
        var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
        var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
        var dLat = this.transformLat(lon - 105.0, lat - 35.0);
        var dLon = this.transformLon(lon - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * this.PI;
        var magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
        return {'lat': dLat, 'lon': dLon};
    },
     
    //WGS-84 to GCJ-02
    gcj_encrypt : function (wgsLat, wgsLon) {
        if (this.outOfChina(wgsLat, wgsLon))
            return {'lat': wgsLat, 'lon': wgsLon};
 
        var d = this.delta(wgsLat, wgsLon);
        return {'lat' : wgsLat + d.lat,'lon' : wgsLon + d.lon};
    },
    //GCJ-02 to WGS-84
    gcj_decrypt : function (gcjLat, gcjLon) {
        if (this.outOfChina(gcjLat, gcjLon))
            return {'lat': gcjLat, 'lon': gcjLon};
         
        var d = this.delta(gcjLat, gcjLon);
        return {'lat': gcjLat - d.lat, 'lon': gcjLon - d.lon};
    },
    //GCJ-02 to WGS-84 exactly
    gcj_decrypt_exact : function (gcjLat, gcjLon) {
        var initDelta = 0.01;
        var threshold = 0.000000001;
        var dLat = initDelta, dLon = initDelta;
        var mLat = gcjLat - dLat, mLon = gcjLon - dLon;
        var pLat = gcjLat + dLat, pLon = gcjLon + dLon;
        var wgsLat, wgsLon, i = 0;
        while (1) {
            wgsLat = (mLat + pLat) / 2;
            wgsLon = (mLon + pLon) / 2;
            var tmp = this.gcj_encrypt(wgsLat, wgsLon)
            dLat = tmp.lat - gcjLat;
            dLon = tmp.lon - gcjLon;
            if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold))
                break;
 
            if (dLat > 0) pLat = wgsLat; else mLat = wgsLat;
            if (dLon > 0) pLon = wgsLon; else mLon = wgsLon;
 
            if (++i > 10000) break;
        }
        //console.log(i);
        return {'lat': wgsLat, 'lon': wgsLon};
    },
    //GCJ-02 to BD-09
    bd_encrypt : function (gcjLat, gcjLon) {
        var x = gcjLon, y = gcjLat;  
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);  
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);  
        bdLon = z * Math.cos(theta) + 0.0065;  
        bdLat = z * Math.sin(theta) + 0.006; 
        return {'lat' : bdLat,'lon' : bdLon};
    },
    //BD-09 to GCJ-02
    bd_decrypt : function (bdLat, bdLon) {
        var x = bdLon - 0.0065, y = bdLat - 0.006;  
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);  
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);  
        var gcjLon = z * Math.cos(theta);  
        var gcjLat = z * Math.sin(theta);
        return {'lat' : gcjLat, 'lon' : gcjLon};
    },
    //WGS-84 to Web mercator
    //mercatorLat -> y mercatorLon -> x
    mercator_encrypt : function(wgsLat, wgsLon) {
        var x = wgsLon * 20037508.34 / 180.;
        var y = Math.log(Math.tan((90. + wgsLat) * this.PI / 360.)) / (this.PI / 180.);
        y = y * 20037508.34 / 180.;
        return {'lat' : y, 'lon' : x};
        /*
        if ((Math.abs(wgsLon) > 180 || Math.abs(wgsLat) > 90))
            return null;
        var x = 6378137.0 * wgsLon * 0.017453292519943295;
        var a = wgsLat * 0.017453292519943295;
        var y = 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
        return {'lat' : y, 'lon' : x};
        //*/
    },
    // Web mercator to WGS-84
    // mercatorLat -> y mercatorLon -> x
    mercator_decrypt : function(mercatorLat, mercatorLon) {
        var x = mercatorLon / 20037508.34 * 180.;
        var y = mercatorLat / 20037508.34 * 180.;
        y = 180 / this.PI * (2 * Math.atan(Math.exp(y * this.PI / 180.)) - this.PI / 2);
        return {'lat' : y, 'lon' : x};
        /*
        if (Math.abs(mercatorLon) < 180 && Math.abs(mercatorLat) < 90)
            return null;
        if ((Math.abs(mercatorLon) > 20037508.3427892) || (Math.abs(mercatorLat) > 20037508.3427892))
            return null;
        var a = mercatorLon / 6378137.0 * 57.295779513082323;
        var x = a - (Math.floor(((a + 180.0) / 360.0)) * 360.0);
        var y = (1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * mercatorLat) / 6378137.0)))) * 57.295779513082323;
        return {'lat' : y, 'lon' : x};
        //*/
    },
    // two point's distance
    distance : function (latA, lonA, latB, lonB) {
        var earthR = 6371000.;
        var x = Math.cos(latA * this.PI / 180.) * Math.cos(latB * this.PI / 180.) * Math.cos((lonA - lonB) * this.PI / 180);
        var y = Math.sin(latA * this.PI / 180.) * Math.sin(latB * this.PI / 180.);
        var s = x + y;
        if (s > 1) s = 1;
        if (s < -1) s = -1;
        var alpha = Math.acos(s);
        var distance = alpha * earthR;
        return distance;
    },
    outOfChina : function (lat, lon) {
        if (lon < 72.004 || lon > 137.8347)
            return true;
        if (lat < 0.8293 || lat > 55.8271)
            return true;
        return false;
    },
    transformLat : function (x, y) {
        var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
        return ret;
    },
    transformLon : function (x, y) {
        var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
        return ret;
    }
};