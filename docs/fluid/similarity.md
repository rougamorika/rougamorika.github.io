# 流体力学(08): 相似原理和量纲分析

## Buckingham Pi 定理

球面上所受到的流体拖拽力$\vec{F}$和什么有关呢?

- 球面直径$D$
- 流体密度$\rho$
- 粘度$\mu$
- 流体流速$\vec{v}$

所以我们可以这么描述上面的这个定理

$$
\vec{F}=F(D,\rho,\mu,\vec{v})
$$

这是显函数的形式,有些时候定理不一定能写成一个显函数.为了更好更全面地描述,我们一般进行一下移项,用隐函数的形式加以表达

$$
\bold{0}=G(D,\rho,\mu,\vec{v},\vec{F})
$$

_这很好,这有什么问题呢??_
问题是,这个隐函数当中的物理量未免多了一点.假如我们真的数学很菜(没错**大部分工程师的数学都很 JB 菜**),那推导定理就只能靠实验呗.你这么一堆物理量用组合书算一下两两之间影响,然后控制其他的......工程师早昏厥了.更恶心一点的事情是,控制变量是有误差的,控制的越多误差就越大,到时候忙活半天测出个没啥大用误差很大的公式,火箭一升天,咔,爆炸了,哭都来不及.

那么,我该如何解决呢?
![alt text](images/how.png)

**我们可以分析单位啊!** 不过,单位有个更加洋气点的名字,叫做**量纲**.比如前面的密度,受力,他们的单位都是**导出**的,是可以化成基本的物理量的.**只要我能把等号两边的单位化成一样的,两者的差距就是比例系数了**.测比例系数不仅少,而且方便.
现在我们就可以端上**Buckingham Pi 定理**了.

!!! note Buckingham Pi Theorem
    如果给定的定理由$n$个物理量和$m$个独立的基本量纲组成,那么研究该定理就和研究其对应的$n-m$个无量纲比例系数的定理完全等价.

用上面的求解拖拽力的实例来研究看看

- 球面直径$D$,单位是$m$,所以量纲是$[\text{L}]$
- 流体密度$\rho$,单位是$kg/m^{3}$,所以量纲$[\text{ML}^{-3}]$
- 粘度$\mu$,单位是$Pa\cdot s$,所以量纲$[\text{ML}^{-1}\text{T}^{-1}]$
- 流体流速$\vec{v}$,单位为$m/s$,所以量纲是$[\text{LT}^{-1}]$

可见,基本量纲就是$\text{M,L,T}$.
**Buckingham 定理的应用方法**是这样的

- 求出独立的量纲和独立量纲数$n$
- 选中给定物理量组$A$中的$n$个,,要求它们包含要求的所有的独立量纲
- 轮转选择剩下$n-m$个物理量$p_{i}$,每次选一个,则这
  个物理量对应的比例系数$\Pi_{i}$就满足$\Pi_{i}=\displaystyle A_{1}^{\alpha_{1}}A_{2}^{\alpha_{2}}...A_{n}^{\alpha_{n}}p_{i}$
- 无量纲数的每一个量纲的指数都是$0$,因此你可以得到一个齐次线性方程.解方程.
- 写出$\Pi$定理的形式,求解完毕

现在我们来写.由于有$4$个物理量,$3$个基本量纲,因此只会有一个无量纲数$\pi$,假设我们取$\rho,\mu,\vec{v}$作为我们的参考物理量,因此

$$
\Pi=\rho^{a}\mu^{b}{v}^{c}D
$$

我们把上面的单位写成量纲形式

$$
\Pi=[\text{ML}^{-3}]^{a}[\text{ML}^{-1}\text{T}^{-1}]^{b}[\text{LT}^{-1}]^{c}L
$$

因此列出方程

$$
\begin{cases}
    a+b=0 \\
    -3a-b+c+1=0 \\
    -b-c=0
\end{cases}
$$

容易解得

$$
\begin{cases}
    a=1\\
    b=-1\\
    c=1
\end{cases}
$$

因此我们的无量纲数就会写成

$$
\Pi_{Re}=\frac{\rho v D}{\mu}
$$

这个下标已经泄露了一点"天机"了,我们马上来介绍.

## 流体力学常见的无量纲数

流体力学中常见的无量纲数非常好记忆,首先我们得介绍一种名曰"惯性"的力,所有流体力学的无量纲数都是某个流体收到的力和"惯性"的比值.由牛顿第二定律,我们可以知道惯性一定是$\rho v^{2} L^{2}$成比例的(近似).接下来只要将不同的力写成比例系数的形式,然后和$\rho v^{2} L^{2}$作比就行了

### 黏性力和惯性的比值的倒数: Reynolds 数

我们现在利用牛顿内摩擦定律来和惯性作比

$$
F=\mu \frac{du}{dy}A\sim \mu \frac{v}{L}L^{2}=\mu v L
$$

所以与惯性的比值就是一个无量纲数

$$
\frac{1}{\text{Re}}= \frac{\mu v L}{\rho v^{2} L^{2}}=\frac{\mu}{\rho v L}
$$

历史原因,我们一般取倒数来命名,称为 **Reynolds 数**

### 压力与惯性的比值: Euler 数

现在我们利用压力的定义式和惯性作比,因此可以得到

$$
F_{P}=\Delta p A=\Delta p L^{2}
$$

因此便于得到

$$
\text{Eu}=\frac{\Delta p L^{2}}{\rho v^{2} L^{2}}=\frac{\Delta p}{\rho v^{2}}
$$

上面的数字一般称为 **Euler 数**

### 重力和惯性的比值的倒数方根: Froude 数

现在我们利用重力的定义式和惯性作比,因此可以得到

$$
W=mg\sim g\rho L^{3}
$$

因此可以得到

$$
\frac{1}{\text{Fr}^{2}}=\frac{g\rho L^{3}}{\rho v^{2} L^{2}}=\frac{gL}{v^{2}}
$$

一般而言用上面的式子来定义 **Froude 数**.

$$
\text{Fr}=\frac{v}{\sqrt{gL}}
$$

### 表面张力和惯性比值的倒数:Weber 数

写出表面张力的式子:

$$
\sigma L
$$

所以直接写就可以了

$$
\frac{1}{\text{We}}=\frac{\sigma L}{\rho v^{2} L^{2}}=\frac{\sigma}{\rho v^{2}L}
$$

### 可压缩性贡献和惯性比值的倒数方根:Mach 数

写出可压缩性贡献的情况
$$
E_{v}A\sim E_{v}L^{2}
$$
其中 $E_{v}$ 是流体的体积模量,已经是个常数.因此我们可得
$$
\frac{1}{\text{Ma}^{2}}=\frac{E_{v}L^{2}}{\rho v^{2} L^{2}}
$$
推出
$$
 \text{Ma}=\frac{v}{\sqrt{\frac{E_{v}}{\rho}}}
$$
下面的式子其实就是当地声速 $c$ 的表达式,因此得到
$$
\text{Ma}=\frac{v}{c}
$$

### 力学无量纲数的框架: Newton 数

假如我们不只是研究上面的无量纲数,而是把任何的外力都去和惯性比比,会发生什么呢?

恭喜你,不会发生特别大的问题,你获得了这个力对应的**Newton 数**.除了我们后面可能要讲的某些和外力无关的无量纲数和上面的马赫数(它是由可压缩性而不是由外力贡献的,只是长得和 Newton 数很像),其他的力学无量纲数都是以牛顿数为框架的.
$$
\text{Ne}=\frac{F_{ext}}{\rho v^{2} L^{2}}
$$

## 相似原理

有的时候,比如说,我们需要知道一架大飞机(C919这种的)的空气动力学参数,进而了解打飞机的设计是否安全,合理,高效.但是你这么大个原型机,一是很难搬来搬去做实验,而是要是出了点什么问题原型机就毁了.这显然是得不偿失的.
因此,假如我们可以用相似的,可能经过一点比例放缩的飞机模型来替代我们的原型机,那么我们的损失就会相对的少一点.下面我们就来介绍一些基础的相似原理.
相似原理的还有一个好处是,对应相似的模型他们的一些流体力学数相同.

### 几何相似

我们认为,如果我们的相似模型

- 在三个维度的长度与原型长度三维的对应比率都相等
- 朝向和原模型完全相同
- 模型与原型机所处在环境完全相同

那么这个模型就和原型**几何相似**,这一点和数学中的几何相似没有任何区别.

对于几何相似,假定给您相似比(线比)$k$,那么根据我们中学所学习的数学知识,你可以得到对应的面积比和体积比

### 运动相似

假如我们模型所在的流场和原型所在的流场方向相同而大小成一固定比例$k$.那么我们称模型和原型之间满足**运动相似**条件.假设我们的原型的流速为$v_{p}$,模型的流速为$v_{m}$,我们就可以得出
$$
\frac{v_{m}}{v_{p}}=C
$$
而我们由中学所学的物理知识可得
$$
\frac{v_{m}}{v_{p}}=\frac{l_{m}t_{p}}{t_{m}l_{p}}
$$
所以
$$
\frac{l_{m}}{l_{p}}\frac{t_{p}}{t_{m}}=C
$$
因此无论如何,你总是能够找到一个数组$(x,y)$,满足
$$
\begin{cases}
    \frac{l_{m}}{l_{p}}=x\\
    \frac{t_{p}}{t_{m}}=y
\end{cases}
$$
因此几何相似和时间相似都得以保持.

#### 运动比例尺

如下的表格是由运动比例尺和长度比例尺得出的其他相关物理量的表格

| 名字 (Name)        | 公式 (Formula)                                                                             | 对应的物理学意义 (Corresponding Physical Meaning) |
|--------------------|--------------------------------------------------------------------------------------------|---------------------------------------------------|
| 时间比例尺         | $\displaystyle k_t = \frac{t'}{t} = \frac{l'/v'}{l/v} = \frac{k_l}{k_v}$                               | 模型与原型对应时间之比                            |
| 加速度比例尺       | $\displaystyle k_a = \frac{a'}{a} = \frac{v'/t'}{v/t} = \frac{k_v}{k_t} = \frac{k_v^2}{k_l}$             | 模型与原型对应加速度之比                          |
| 体积流量比例尺     | $\displaystyle k_{qV} = \frac{q'_V}{q_V} = \frac{l'^3/t'}{l^3/t} = \frac{k_l^3}{k_t} = k_l^2 k_v$         | 模型与原型对应体积流量之比                        |
| 运动黏度比例尺     | $\displaystyle k_ν = \frac{ν'}{ν} = \frac{l'^2/t'}{l^2/t} = \frac{k_l^2}{k_t} = k_l k_v$               | 模型与原型对应运动黏度之比                        |
| 角速度比例尺       | $\displaystyle k_ω = \frac{ω'}{ω} = \frac{v'/l'}{v/l} = \frac{k_v}{k_l}$                               | 模型与原型对应角速度之比                          |

上面的比例尺告诉我们,重点是搞清楚长度比例尺$k_{l}$和速度比例尺$k_{v}$.记忆比例尺的最简单方法是写出想要求得的物理量的量纲,然后把它写成由长度和速度(长度除时间)的量纲形式,然后将这些统统改成对应的比例系数就可以了

| 物理量 (Quantity)             | 标准量纲 (Standard Dimension) | 用 L, V 表示的量纲 (Dimension in L, V)                                  | 比例尺推导 (Scale Factor Derivation) | 最终比例尺公式 (Final Scale Factor Formula)           |
| :---------------------------- | :---------------------------- | :---------------------------------------------------------------------- | :----------------------------------- | :------------------------------------------------ |
| **时间 (Time, t)**            | $\displaystyle [T]$                       | $\displaystyle T \sim \frac{L}{V} \implies [L V^{-1}]$                             | $\displaystyle L \to k_l, V \to k_v$             | $\displaystyle k_t = k_l k_v^{-1} = \frac{k_l}{k_v}$            |
| **加速度 (Acceleration, a)**  | $\displaystyle [L T^{-2}]$                | $\displaystyle T^{-2} \sim (\frac{L}{V})^{-2} = L^{-2}V^2 \implies [L L^{-2}V^2] = [L^{-1}V^2]$ | $\displaystyle L \to k_l, V \to k_v$             | $\displaystyle k_a = k_l^{-1} k_v^2 = \frac{k_v^2}{k_l}$        |
| **体积流量 (Volumetric Flow Rate, qV)** | $\displaystyle [L^3 T^{-1}]$              | $\displaystyle T^{-1} \sim (\frac{L}{V})^{-1} = L^{-1}V \implies [L^3 L^{-1}V] = [L^2 V]$ | $\displaystyle L \to k_l, V \to k_v$             | $\displaystyle k_{qV} = k_l^2 k_v$                            |
| **运动黏度 (Kinematic Viscosity, ν)** | $\displaystyle [L^2 T^{-1}]$              | $\displaystyle T^{-1} \sim L^{-1}V \implies [L^2 L^{-1}V] = [L V]$                   | $\displaystyle L \to k_l, V \to k_v$             | $\displaystyle k_ν = k_l k_v$                                 |
| **角速度 (Angular Velocity, ω)** | $\displaystyle [T^{-1}]$                  | $\displaystyle T^{-1} \sim (\frac{L}{V})^{-1} = [L^{-1} V]$                          | $\displaystyle L \to k_l, V \to k_v$             | $\displaystyle k_ω = k_l^{-1} k_v = \frac{k_v}{k_l}$            |

### 动力相似准则

除了上面的运动学带来的相似,我们还要研究由动力学带来的相似.  
我们认为:假如模型的受力方向和原型相同,受力大小和原型成比例$k_{f}$,那么我们就认为原型和模型之间是动力相似的.

#### 动力比例尺

由于动力比例尺还和质量有关，一般我们为了便利取密度比例尺$k_{\rho}$,我们还是可以用上面的方法来推导和记忆我们的比例尺

| 物理量 (Quantity)                     | 标准量纲 (Standard Dimension) | 用 $\displaystyle \rho$, L, V 表示的量纲 (Dimension in $\rho$, L, V)                                      | 比例尺推导 (Scale Factor Derivation)           | 最终比例尺公式 (Final Scale Factor Formula)           |
| :------------------------------------ | :---------------------------- | :------------------------------------------------------------------------------------------ | :--------------------------------------------- | :------------------------------------------------ |
| **力 (Force, F)**                     | $\displaystyle [M L T^{-2}]$              | $\displaystyle M \sim \rho L^3, T^{-2} \sim L^{-2}V^2 \implies [\rho L^3 L L^{-2}V^2] = [\rho L^2 V^2]$     | $\displaystyle \rho \to k_\rho, L \to k_l, V \to k_v$      | $\displaystyle k_F = k_\rho k_l^2 k_v^2$                      |
| **力矩 (Torque, M) / 功 (Work) / 能 (Energy)** | $\displaystyle [M L^2 T^{-2}]$             | $\displaystyle M \sim \rho L^3, T^{-2} \sim L^{-2}V^2 \implies [\rho L^3 L^2 L^{-2}V^2] = [\rho L^3 V^2]$    | $\displaystyle \rho \to k_\rho, L \to k_l, V \to k_v$      | $\displaystyle k_M = k_\rho k_l^3 k_v^2$                      |
| **压强 (Pressure, p) / 应力 (Stress)** | $\displaystyle [M L^{-1} T^{-2}]$           | $\displaystyle M \sim \rho L^3, T^{-2} \sim L^{-2}V^2 \implies [\rho L^3 L^{-1} L^{-2}V^2] = [\rho V^2]$      | $\displaystyle \rho \to k_\rho, L \to k_l, V \to k_v$      | $\displaystyle k_p = k_\rho k_v^2$                            |
| **功率 (Power, P)**                   | $\displaystyle [M L^2 T^{-3}]$             | $\displaystyle M \sim \rho L^3, T^{-3} \sim L^{-3}V^3 \implies [\rho L^3 L^2 L^{-3}V^3] = [\rho L^2 V^3]$    | $\displaystyle \rho \to k_\rho, L \to k_l, V \to k_v$      | $\displaystyle k_P = k_\rho k_l^2 k_v^3$                      |
| **动力黏度 (Dynamic Viscosity, $\displaystyle \mu$)** | $\displaystyle [M L^{-1} T^{-1}]$           | $\displaystyle M \sim \rho L^3, T^{-1} \sim L^{-1}V \implies [\rho L^3 L^{-1} L^{-1}V] = [\rho L V]$         | $\displaystyle \rho \to k_\rho, L \to k_l, V \to k_v$      | $\displaystyle k_\mu = k_\rho k_l k_v$                        |

## 相似准则对应的流体力学数守恒

之所以我们要研究上面的流体力学准则数,就是因为在相似准则满足的条件下,对应的流体力学准则数相等.

### 动力相似的礼物:力学准则数的守恒

动力相似其实是重要的,因为只要我们能够使模型和原型之间满足动力相似,那么居于牛顿数框架下的**一切力学准则数都对应相等**.这取决于你关注对应模型的哪个力.下面的表格解释了不同对应力场对应的不同准则数的守恒和用途

| 主导力 (Dominant Force) | 对应相似的力场/性质 (Corresponding Force Field/Nature) | 对应相等的力学准则数 (Dimensionless Number to be Equated) | 速度比例尺与长度比例尺的约束关系 ($\displaystyle k_v$ vs $\displaystyle k_l$ Constraint) |
| :---------------------- | :----------------------------------------------------- | :-------------------------------------------------------- | :------------------------------------------------------------------- |
| **粘性力 (Viscous Force)** | 流体内部摩擦 (Internal Fluid Friction)                 | **雷诺数 (Reynolds Number, Re)** <br> $\displaystyle Re = \frac{\rho V L}{\mu} = \frac{V L}{\nu}$ | $\displaystyle Re_m = Re_p \implies k_v k_l = k_\nu$ <br> (要求运动粘度比例尺 $\displaystyle k_\nu = \frac{\nu_m}{\nu_p}$ 已知或选定) <br> 或 $\displaystyle k_v = \frac{k_\nu}{k_l}$ |
| **重力 (Gravity Force)**    | 重力场作用 (Gravitational Field)                       | **弗劳德数 (Froude Number, Fr)** <br> $\displaystyle Fr = \frac{V}{\sqrt{g L}}$ | $\displaystyle Fr_m = Fr_p \implies k_v = \sqrt{k_g k_l}$ <br> (通常 $\displaystyle g_m = g_p$, 即 $\displaystyle k_g=1$) <br> **因此：** $\displaystyle k_v = \sqrt{k_l} = k_l^{1/2}$ |
| **压力 (Pressure Force)**   | 压力梯度驱动 (Pressure Gradient)                       | **欧拉数 (Euler Number, Eu)** <br> $\displaystyle Eu = \frac{\Delta p}{\rho V^2}$ | $\displaystyle Eu_m = Eu_p \implies k_p = k_\rho k_v^2$ <br> (此为压力比例尺 $\displaystyle k_p$ 的结果，通常不由 Eu 直接设定 $\displaystyle k_v$ 与 $\displaystyle k_l$ 的关系，而是作为相似性的结果) |
| **弹性力 (Elastic Force)**  | 流体可压缩性 (Fluid Compressibility)                   | **马赫数 (Mach Number, Ma)** <br> $\displaystyle Ma = \frac{V}{c}$ ($\displaystyle c$ 为声速) | $\displaystyle Ma_m = Ma_p \implies k_v = k_c$ <br> (要求速度比例尺等于声速比例尺 $\displaystyle k_c = \frac{c_m}{c_p}$，与 $\displaystyle k_l$ 无直接普适关系) |
| **表面张力 (Surface Tension Force)** | 界面效应 (Interfacial Effects)                         | **韦伯数 (Weber Number, We)** <br> $\displaystyle We = \frac{\rho L V^2}{\sigma}$ ($\displaystyle \sigma$ 为表面张力系数) | $\displaystyle We_m = We_p \implies k_\rho k_l k_v^2 = k_\sigma$ <br> $\displaystyle k_v = \sqrt{\frac{k_\sigma}{k_\rho k_l}}$ <br> (要求表面张力系数比例尺 $\displaystyle k_\sigma = \frac{\sigma_m}{\sigma_p}$ 已知或选定) |