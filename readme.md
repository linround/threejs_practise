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

## [关于透明物体](manual/transparency-intersecting-planes-fixed.html)，像素depth的一些问题
- 通常使用depth记录像素深度，从而决定是否绘制该像素；这对于不透明的物体比较有用，但是对于透明物体没有效；
- 解决透明像素点的方式就是。先把透明的东西排序，把后面的东西画出来，再把前面的东西画出来；
- 处理凸面体，例如球形或者立方体；一种解决方案就是添加每个立方体到这个场景两次，一次是渲染背部，一次渲染前面；
- 使用alphaTest 处理透明问题
## 文件类型缺陷
- `.obj `格式的文件没有将模块切割，没有层次。所以无法单独操作某个模型；


## babylonjs和threejs之间的优劣
- babylonjs 文件比较细致，维护的比较好，支持ts
- threejs的例子很多，社区庞大


## 关于浏览器webgl的一些限制
- 浏览器会限制webgl 上下文的数量。通常是8个
- 多个canvas之间无法共享之间的上下文
- OffscreenCanvas 的兼容性问题，2020年之后只有chrome支持该属性功能


## 关于地球仪上按需渲染的优化
- 对于labels，只显示面向相机的label
- 对于labels数量，根据区域面积，控制labels的个数


## 框架的选择
- webGPU 稳步地支持 threejs库以及babylonjs
- [playCanvas在2022年，承诺支持webGPU]( https://github.com/playcanvas/engine/issues/3986);

## 区域识别方案
- 使用gpu挑选
  - 例如在特定区域定义一个特殊的颜色，然后使用gpu获取像素的颜色，最终根据颜色值来判断选中的区域 

## babylon
- babylonView
  - [babylonView的使用，](https://doc.babylonjs.com/features/featuresDeepDive/babylonViewer)[基于webComponent的实现](https://www.npmjs.com/package/babylonjs-viewer)
  - [viewer源码](https://github.com/BabylonJS/Babylon.js/tree/master/packages/tools/viewer)

# 关于图形填充
## 关于扫描填充
- 利用奇偶校验进行内部区域识别
- 将各种多边形分解为三角形，因为三角形是凸多边形，这样可以简化通用填充算法。
- 利用图形与扫描线的一些相关特征，例如使用增量方法可以减少重复填充[计算机图形学6.10]()
## 关于边界填充算法
- 4-连通区域
  - 结合堆栈和扫描线结构进行区域填充[计算机图形6.13]()
- 8-连通区域
## 反走样相关
- 奈奎斯特香农定义，增加采样率。在高分辨率上进行采样，低分辨率进行显示。即过取样
- 子像素加权掩模
- 关于45°线的亮度矫正。（即利用线的斜率来调整其亮度）
## 关于图元及属性的算法
### 图元即用来描述各种图形元素的函数，也称为图形输出原语；
- 用于直线段路径绘制像素的三种方法：DDA算法，Bresenham算法和中点算法；中带你算法和Bresenham算法是等同并且最有效的
- 圆和椭圆采用中点算法并根据其对程序进行有效而精准的扫描转换
- 扫描线算法通常用于填充多边形，圆和椭圆，
  - 内点填充用于扫描线与边界的每一对交点之间的像素位置从左往右进行
  - 对于多边形来说，扫描线与其相交于顶点可导致两个橡胶垫，缩短某些边可解决该问题
  - 如果把填充去限定为凸多边形，可以简化扫描填充
  - 如果场景中所有区域都是三角形，则扫描线填充算法可以进一步简化
- 通过调整像素强度的反走样过程来改善光栅图元的外貌
  - 过取样是一种反走样方法，即将每一像素看作子像素的组合并计算每一子像素的强度及其所有子像素的平均值。
  - 通过按照子像素的位置来确定其贡献值，并给中心以最高权值
## [babylon中 加载.glb文件的问题](./deepDive/glb-test.html);[webpack中的示例](https://github.com/RaananW/babylonjs-webpack-es6/blob/master/src/scenes/loadModelAndEnv.ts)

# babylonjs
- 相机跟随
  - [使用parent相关性](./babylon/distant-hills-4.html)
  - [使用FollowCamera](./babylon/distant-hills-5.html)

# 有趣的demo
- [第一人称射击类游戏](https://github.com/BeardScript/RogueFPSExample)；[here](https://rogueengine.io/examples)
- [sho1374k](https://github.com/sho1374k)


# 待完成
- [关于video标签](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)

# 总结
- 再伟大的艺术大师也不可能仅仅通过按几个按钮或者随便刷几笔就做出惊人的艺术作品来，相反，他们也要经过大量的学习与训练，包括：人体结构，合成，灯光，动画原理等等等等；
