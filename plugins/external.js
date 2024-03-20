import Vue from "vue";

import {VueMaskDirective, VueMaskFilter} from 'v-mask'
Vue.directive("mask", VueMaskDirective);
Vue.filter("vmask", VueMaskFilter);
