
//引入的mock文件 Mock为对象
import Mock from 'mockjs'

//不需要暴露直接引入，webpack中图片、json，不需要对外暴露，因为默认就是对外暴露，直接引入即可
import banner from './banner.json'
import floor from './floor.json'

// 通过对象中的一个属性创建mock,第一个参数是模拟的请求地址，第二个参数是：请求的数据
Mock.mock('/mock/banner', { code: 200, data: banner }) //模拟首页的轮播的数据

Mock.mock('/mock/floor', { code: 200, data: floor })//模拟floor的数据