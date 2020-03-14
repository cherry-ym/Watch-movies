import Vue from 'vue';
import MessageBox from './MessageBox';

//export 本质上就是规定模块[js文件]的对外接口[属性或方法]
//export default 则是在 export 的基础上，为规定模块提供一个默认的对外接口
export var messageBox = (function(){
    var defaults = {     //默认值
        title : '',
        content : '',
        cancel : '',
        ok : '',
        handleCancel : null,
        handleOk : null
    };

    var Mycomponent = Vue.extend(MessageBox);

    return function(opts){  //配置参数
        for(var attr in opts){
            defaults[attr] = opts[attr];
        }

        var vm = new Mycomponent({
            el : document.createElement('div'),
            data : {
                title : defaults.title,
                content : defaults.content,
                cancel : defaults.cancel,
                ok : defaults.ok
            },
            methods : {
                handleCancel(){
                    defaults.handleCancel && defaults.handleCancel.call(this);
                    document.body.removeChild(vm.$el);
                },
                handleOk(){
                    defaults.handleOk && defaults.handleOk.call(this);
                    document.body.removeChild(vm.$el);
                }
            }
        });

        document.body.appendChild(vm.$el);
    };
})();