/**
 * baidu webuploader 官方网站例子
 * modify: wujian
 * */
var UPLOADIMG = function uploadImg(uploadUrl) {
    var $ = jQuery,
        $wrap = $('#uploader'),
        $queueWrap=$wrap.find('.filelist-wrap'),            //图片列表容器
        $queue = $('<ul class="filelist"></ul>').appendTo($queueWrap),// 图片列表
        $statusBar = $wrap.find('.statusBar'),          // 状态栏，包括进度和控制按钮
        $info = $statusBar.find('.info'),               // 文件总体选择信息。
        $upload = $wrap.find('.uploadBtn'),             // 上传按钮
        $placeHolder = $wrap.find('.placeholder'),      // 没选择文件之前的内容。
        $progress = $statusBar.find('.progress').hide(),// 总体进度条
        fileCount = 0,                                  // 添加的文件数量
        fileSize = 0,                                   // 添加的文件总大小
        ratio = window.devicePixelRatio || 1,           // 优化retina, 在retina下这个值是2
        thumbnailWidth = 500 * ratio,                   // 缩略图宽
        thumbnailHeight = 500 * ratio,                  // 缩略图高
        state = 'pedding',                              // 可能有pedding, ready, uploading, confirm, done.
        percentages = {},                               // 所有文件的进度信息，key为file id
        supportTransition = (function () {             // 是否支持transition变换
            var s = document.createElement('p').style,
                r = 'transition' in s ||
                    'WebkitTransition' in s ||
                    'MozTransition' in s ||
                    'msTransition' in s ||
                    'OTransition' in s;
            s = null;
            return r;
        })(),
        uploader; // WebUploader实例

    if (!WebUploader.Uploader.support()) {
        alert('Web Uploader 不支持您的浏览器，请尝试安装flash插件或升级您的浏览器');
        throw new Error('WebUploader does not support the browser you are using.');
    }

    // 实例化
    uploader = WebUploader.create({
        pick: {
            id: '#filePicker',
            label: '点击选择图片'
        },
        dnd: '#uploader .queueList',
        paste: document.body,

        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        },
        swf:  '/js/lib//webuploader/Uploader.swf',
        disableGlobalDnd: true,
        chunked: true,
        server: uploadUrl,
        fileNumLimit: 9,
        fileSizeLimit: 5 * 1024 * 1024,    // 200 M
        fileSingleSizeLimit: 1 * 1024 * 1024    // 50 M
    });

    // 添加“添加文件”的按钮，
    uploader.addButton({
        id: '#filePicker2',
        label: '继续添加'
    });

    //左右滑动按钮
    (function addSlideBtn(){
        //绑定事件
        $wrap.on("click",".slide",function(){
            var currentLeft=$queue.position().left,
                $this=$(this),
                maxLeft=$queueWrap.width()-$queue.width(),
                listConLiWidth=$queue.children("li:eq(0)").outerWidth(true);

            if(!maxLeft) return;
            if($this.hasClass("pre")){
                currentLeft=currentLeft+listConLiWidth*3;
                //if(currentLeft>0) currentLeft=0;
            }
            else if($this.hasClass("next")){
                currentLeft=currentLeft-listConLiWidth*3;
                //if(currentLeft<maxLeft) currentLeft=maxLeft;
            }
            $queue.css("left",currentLeft);
            //溢出动画效果
            if(currentLeft>0 || maxLeft>=0){
                setTimeout(function(){
                    $queue.css("left",0);
                },100);
            }
            else if(currentLeft<maxLeft){
                setTimeout(function(){
                    $queue.css("left",maxLeft);
                },100);
            }
        });
    })();

    //全屏查看图片
    /*
    (function fullSrceen(){
        var $full=$("<div class='webuploader-full-screen' id='webuploader-full-screen'><div class='close'>&times;</div><img src=''></div>").appendTo("body");
        $full.on("click",".close",function(){
            $(this).parents(".webuploader-full-screen").hide();
        });
    })();
    */

    // 当有文件添加进来时执行，负责view的创建
    function addFile(file) {
        var $li = $('<li id="' + file.id + '">' +
                '<p class="title">' + file.name + '</p>' +
                '<p class="imgWrap"></p>' +
                '<p class="progress"><span></span></p>' +
                '</li>'),

            $btns = $('<div class="file-panel">' +
                '<span class="cancel">删除</span>' +
                '<span class="rotateRight">向右旋转</span>' +
                '<span class="rotateLeft">向左旋转</span></div>').appendTo($li),
            $prgress = $li.find('p.progress span'),
            $wrap = $li.find('p.imgWrap'),
            $info = $('<p class="error"></p>'),

            showError = function (code) {
                switch (code) {
                    case 'exceed_size':
                        text = '文件大小超出';
                        break;

                    case 'interrupt':
                        text = '上传暂停';
                        break;

                    default:
                        text = '上传失败，请重试';
                        break;
                }

                $info.text(text).appendTo($li);
            };

        if (file.getStatus() === 'invalid') {
            showError(file.statusText);
        } else {
            // @todo lazyload
            $wrap.text('预览中');
            uploader.makeThumb(file, function (error, src) {
                if (error) {
                    $wrap.text('不能预览');
                    return;
                }

                var img = $('<img class="img" src="' + src + '">');
                $wrap.empty().append(img);
            }, thumbnailWidth, thumbnailHeight);

            percentages[file.id] = [file.size, 0];
            file.rotation = 0;
        }

        file.on('statuschange', function (cur, prev) {
            if (prev === 'progress') {
                $prgress.hide().width(0);
            } else if (prev === 'queued') {
                $li.off('mouseenter mouseleave');
                $btns.remove();
            }

            // 成功
            if (cur === 'error' || cur === 'invalid') {
                console.log(file.statusText);
                showError(file.statusText);
                percentages[file.id][1] = 1;
            } else if (cur === 'interrupt') {
                showError('interrupt');
            } else if (cur === 'queued') {
                percentages[file.id][1] = 0;
            } else if (cur === 'progress') {
                $info.remove();
                $prgress.css('display', 'block');
            } else if (cur === 'complete') {
                $li.append('<span class="success"></span>');
            }

            $li.removeClass('state-' + prev).addClass('state-' + cur);
        });

        $li.on('mouseenter', function () {
            $btns.stop().animate({height: 30});
        });

        $li.on('mouseleave', function () {
            $btns.stop().animate({height: 0});
        });

        $li.on("click",".img",function(e){
            //$("#webuploader-full-screen").find("img").eq(0).attr("src",$(this).attr("src")).end().end().css("display","table");
            parent.open($(this).attr("src"));
        });

        $btns.on('click', 'span', function (e) {
            var index = $(this).index(),
                deg;

            switch (index) {
                case 0:
                    uploader.removeFile(file);
                    return;

                case 1:
                    file.rotation += 90;
                    break;

                case 2:
                    file.rotation -= 90;
                    break;
            }

            if (supportTransition) {
                deg = 'rotate(' + file.rotation + 'deg)';
                $wrap.css({
                    '-webkit-transform': deg,
                    '-mos-transform': deg,
                    '-o-transform': deg,
                    'transform': deg
                });
            } else {
                $wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');
            }
        });

        $li.appendTo($queue);
    }

    // 负责view的销毁
    function removeFile(file) {
        var $li = $('#' + file.id);

        delete percentages[file.id];
        updateTotalProgress();
        $li.off().find('.file-panel').off().end().remove();
    }

    function updateTotalProgress() {
        var loaded = 0,
            total = 0,
            spans = $progress.children(),
            percent;

        $.each(percentages, function (k, v) {
            total += v[0];
            loaded += v[0] * v[1];
        });

        percent = total ? loaded / total : 0;

        spans.eq(0).text(Math.round(percent * 100) + '%');
        spans.eq(1).css('width', Math.round(percent * 100) + '%');
        updateStatus();
    }

    function updateStatus() {
        var text = '', stats;

        if (state === 'ready') {
            text = '选中' + fileCount + '张图片，共' +
                WebUploader.formatSize(fileSize) + '。';
        } else if (state === 'confirm') {
            stats = uploader.getStats();
            if (stats.uploadFailNum) {
                text = '已成功上传' + stats.successNum + '张照片至XX相册，' +
                    stats.uploadFailNum + '张照片上传失败，<a class="retry" href="#">重新上传</a>失败图片或<a class="ignore" href="#">忽略</a>'
            }

        } else {
            stats = uploader.getStats();
            text = '共' + fileCount + '张（' +
                WebUploader.formatSize(fileSize) +
                '），已上传' + stats.successNum + '张';

            if (stats.uploadFailNum) {
                text += '，失败' + stats.uploadFailNum + '张';
            }
        }

        $info.html(text);
    }

    function setState(val) {
        var file, stats;

        if (val === state) {
            return;
        }

        $upload.removeClass('state-' + state);
        $upload.addClass('state-' + val);
        state = val;

        switch (state) {
            case 'pedding':
                $placeHolder.removeClass('element-invisible');
                $queue.parents(".queueList").removeClass('filled');
                $queue.hide();
                $statusBar.addClass('element-invisible');
                uploader.refresh();
                break;

            case 'ready':
                $placeHolder.addClass('element-invisible');
                $('#filePicker2').removeClass('element-invisible');
                $queue.parents(".queueList").addClass('filled');
                $queue.show();
                $statusBar.removeClass('element-invisible');
                uploader.refresh();
                break;

            case 'uploading':
                $('#filePicker2').addClass('element-invisible');
                $progress.show();
                $upload.text('暂停上传');
                break;

            case 'paused':
                $progress.show();
                $upload.text('继续上传');
                break;

            case 'confirm':
                $progress.hide();
                $upload.text('开始上传').addClass('disabled');

                stats = uploader.getStats();
                if (stats.successNum && !stats.uploadFailNum) {
                    setState('finish');
                    return;
                }
                break;
            case 'finish':
                stats = uploader.getStats();
                if (stats.successNum) {
                    alert('上传成功');
                } else {
                    // 没有成功的图片，重设
                    state = 'done';
                    location.reload();
                }
                break;
        }

        updateStatus();
    }
    
    //删除所有文件
    uploader.removeAllFiles =function (){
        var files=uploader.getFiles();
        files.forEach(function(val){
            uploader.removeFile(val);
        });
    };

    uploader.onUploadProgress = function (file, percentage) {
        var $li = $('#' + file.id),
            $percent = $li.find('.progress span');

        $percent.css('width', percentage * 100 + '%');
        percentages[file.id][1] = percentage;
        updateTotalProgress();
    };

    uploader.onFileQueued = function (file) {
        fileCount++;
        fileSize += file.size;

        if (fileCount === 1) {
            $placeHolder.addClass('element-invisible');
            $statusBar.show();
        }

        addFile(file);
        setState('ready');
        updateTotalProgress();
    };

    uploader.onFileDequeued = function (file) {
        fileCount--;
        fileSize -= file.size;

        if (!fileCount) {
            setState('pedding');
        }

        removeFile(file);
        updateTotalProgress();

    };

    uploader.on('all', function (type) {
        var stats;
        switch (type) {
            case 'uploadFinished':
                setState('confirm');
                break;

            case 'startUpload':
                setState('uploading');
                break;

            case 'stopUpload':
                setState('paused');
                break;

        }
    });

    uploader.onError = function (code) {
        var text = '';
        switch( code ) {
            case  'F_DUPLICATE' : text = '该文件已经被选择了!' ;
                break;
            case  'Q_EXCEED_NUM_LIMIT' : text = '上传文件数量超过限制!' ;
                break;
            case  'F_EXCEED_SIZE' : text = '文件大小超过限制!';
                break;
            case  'Q_EXCEED_SIZE_LIMIT' : text = '所有文件总大小超过限制!';
                break;
            case 'Q_TYPE_DENIED' : text = '文件类型不正确或者是空文件!';
                break;
            default : text = code;
                break;
        }
        alert( text );
    };

    $upload.on('click', function () {
        if ($(this).hasClass('disabled')) {
            return false;
        }

        if (state === 'ready') {
            uploader.upload();
        } else if (state === 'paused') {
            uploader.upload();
        } else if (state === 'uploading') {
            uploader.stop();
        }
    });

    $info.on('click', '.retry', function () {
        uploader.retry();
    });

    $info.on('click', '.ignore', function () {
        alert('todo');
    });

    $upload.addClass('state-' + state);
    updateTotalProgress();

    return uploader;
};