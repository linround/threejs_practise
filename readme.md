# 简介
本项目主要用于练习threejs操作；同时整理相关demo
## scene Graph
在3D引擎中，场景图是图中节点的层次结构；每一个节点都代表了一个局部空间；
## [uv](./manual/custom-buffergeometry-cube-indexed.html)
UV 这里是指u,v纹理贴图坐标的简称；UV就是将图像上每一个点精确对应到模型物体的表面. 在点与点之间的间隙位置由软件进行图像光滑插值处理. 这就是所谓的UV贴图.
模型每个顶点也有个uv坐标，会和图片上的uv对应。在光栅化的三角形遍历阶段会根据顶点的uv插值出每个像素的uv，最后在片元着色阶段每个像素的uv对应图片的uv，从而得出每个像素的颜色，最终很多像素在一起就变成了一张图片。

比如说：四边形中，四个顶点uv`[(0,0),(0,1),(1,0),(1,1)]`;图片也具有自己的uv，这个时候将图片的uv与几何顶点的uv进行对应，即可完成对该集合图像的纹理贴图（开始对开始，
结束对结束；中间使用差值算法补充）

## 写代码的常见问题
- 页面无法看到场景，注意相机的位置能否看到对应的场景
