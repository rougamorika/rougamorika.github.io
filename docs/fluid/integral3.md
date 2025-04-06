# 流体力学(06):关于流体的积分关系(下篇)

## 流体动量矩方程

假如我们将我们令 Reynolds 输运方程的广延量为角动量$H$,那么 Reynolds 方程就变为下面形式
$$
{\frac{dH}{dt}=\frac{\partial }{\partial t}\iiint_{CV} \eta_{H} \rho dV+\iint_{CS}\eta_{H} \rho (\vec{v}_{net\,CS}\cdot \vec{n})dA}
$$
现在的目标是处理$\eta_{H}$,由于角动量本身是由各个点动量的矩贡献的,并不能直接用$H/m$这样的平均值来替代(不是线性),单位质量的体积就应该是微元之间的比值
$$
\eta_{H}=\frac{dH}{dm}
$$
带入得到
$$
{\frac{dH}{dt}=\frac{\partial }{\partial t}\iiint_{CV} \frac{dH}{dm} \rho dV+\iint_{CS}\frac{dH}{dm} \rho (\vec{v}_{net\,CS}\cdot \vec{n})dA}
$$
由动量矩的定义可以得到
$$
H=\int_{syst}(\vec{r}\times \vec{v})dm
$$
所以就有
$$
\frac{dH}{dm}=\vec{r}\times \vec{v}
$$
带入得到
$$
{\frac{dH}{dt}=\frac{\partial }{\partial t}\iiint_{CV} (\vec{r}\times \vec{v}) \rho dV+\iint_{CS}(\vec{r}\times \vec{v}) \rho (\vec{v}_{r}\cdot \vec{n})dA}
$$
因为我们知道角动量随时间的导数是动量导数,在控制体不变形的条件下,满足
$$
\sum M_{0}={\frac{dH}{dt}=\frac{d }{dt}\iiint_{CV} (\vec{r}\times \vec{v}) \rho dV+\iint_{CS}(\vec{r}\times \vec{v}) \rho (\vec{v}_{r}\cdot \vec{n})dA}
$$
上面的方程一般称之为**动量矩方程**.

## 流体能量方程

现在我们考虑将前文的广延量改为热力学能$E$.此时$\eta=e$称为**单位质量能**.
$$
{\frac{dE}{dt}=\frac{d }{dt}\iiint_{CV} e \rho dV+\iint_{CS}e\rho (\vec{v}_{net\,CS}\cdot \vec{n})dA}
$$
考虑前文所叙的热力学第一定律,假设控制体不发生变化,上面的式子还可以改写成
$$
\frac{dQ}{dt}-\frac{dW}{dt}=\frac{d }{dt}\iiint_{CV} e \rho dV+\iint_{CS}e\rho (\vec{v}_{net\,CS}\cdot \vec{n})dA
$$
现在我们来进一步探讨关于$e$的内涵,在热力学中我们熟知
$$
e=\frac{1}{2}v^{2}+u+gz
$$
而我们现在着重分析$Q,W$变化带来的贡献,也就是左边式子的情况

### 控制体功的变化

现在我们来讨论控制体功的变化,这其实不是流体力学问题,而是之前我们热力学课程当中分析过的问题.事实上,任何的控制体的功总是分为如下四个分量,

- $W_{norm}$,即法向应力(说白了就是压力)做的功,是一个膨胀功
- $W_{shaft}$,一般叫做轴功,是一种技术功，一般用来表示叶轮机传递的功率等
- $W_{shear}$,即剪切功,一般是由于流体与管面的剪切力造成的功的变化.
- $W_{other}$,其他的功,比如对流体通电可能会做电功之类的.

那么自然地,我们就应该写出下面的表达式,并仔细分别分析上面四种不同的功的贡献.

$$
\dot{W}=\dot{W_{norm}}+\dot{W_{shaft}}+\dot{W_{shear}}+\dot{W_{other}}
$$


