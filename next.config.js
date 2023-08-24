/** @type {import('next').NextConfig} */
const path=require('path')
const nextConfig = {
    sassOptions:{
        includePaths:[path.join(__dirname,'styles')]//用来自定义scss选项
    }
}
// console.log(path.join(__dirname,'styles'))
module.exports = nextConfig
