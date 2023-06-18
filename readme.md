# 简介
本项目主要用于练习threejs操作；同时整理相关demo
## scene Graph
在3D引擎中，场景图是图中节点的层次结构；每一个节点都代表了一个局部空间；
## [uv](./manual/custom-buffergeometry-cube-indexed.html)
UV 这里是指u,v纹理贴图坐标的简称；UV就是将图像上每一个点精确对应到模型物体的表面. 在点与点之间的间隙位置由软件进行图像光滑插值处理. 这就是所谓的UV贴图.
模型每个顶点也有个uv坐标，会和图片上的uv对应。在光栅化的三角形遍历阶段会根据顶点的uv插值出每个像素的uv，最后在片元着色阶段每个像素的uv对应图片的uv，从而得出每个像素的颜色，最终很多像素在一起就变成了一张图片。

比如说：四边形中，四个顶点uv`[(0,0),(0,1),(1,0),(1,1)]`;图片也具有自己的uv，这个时候将图片的uv与几何顶点的uv进行对应，即可完成对该集合图像的纹理贴图（开始对开始，
结束对结束；中间使用差值算法补充）

## 动画过度
- 透明度；缺点是前后状态出现交叉
- 缩放；确定是较小的物体会立即消失
- 目标变形;方案较好
- [morphTargetInfluences 似乎和morphAttributes.position维度有关](./manual/lots-of-objects-morphtargets.html)


## THREE.MathUtils.lerp(x,y,t)
- lerp 函数： (1 - t) * x + t * y;即可看成 `[(y-x)/1]*t+x`

## 性能优化方案
- 按需渲染
- [合并多个几何体到一个几何体](./manual/lots-of-objects-merged.html)

## 写代码的常见问题
- 页面无法看到场景，注意相机的位置能否看到对应的场景


## `clientWidth` 和 `width` 的区别
- `clientWidth`包含padding,不包含border、margins、滚动条
- `width`可能会包含border，因为有border-box盒模型
- [疑问到底有何区别？为什么在设置元素css的width为100%，然后再指定元素固定宽度，最终值会不一样？](./manual/offscreencanvas-w-orbitcontrols.js) 108行初次执行时；

## 加载模型通常会遇见的一些问题
- 模型的大小不确定
- 旋转的角度出现错误
- 没有mtl文件 或者 材质错误或者兼容问题
- 纹理太大
- 
## 文件类型缺陷
- `.obj `格式的文件没有将模块切割，没有层次。所以无法单独操作某个模型；


# 总结
- 再伟大的艺术大师也不可能仅仅通过按几个按钮或者随便刷几笔就做出惊人的艺术作品来，相反，他们也要经过大量的学习与训练，包括：人体结构，合成，灯光，动画原理等等等等；
