import Vue from "vue";
import SvgIcon from "@/components/svgLoader/Index.vue";
//全局注册组件
Vue.component("svg-icon", SvgIcon);
const requireAll = (r) => r.keys().map(r);
// 加载目录下的所有的 svg 文件
requireAll(require.context("./svg", false, /\.svg$/));