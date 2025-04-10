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

现在我们来逐一分析它们的物理意义和数学表达。

#### 1. 法向应力功 ($\displaystyle \dot{W}_{norm}$) 与 流功 (Flow Work)

法向应力功是由作用在控制表面 (CS) 上的压力 (法向应力) 所做的功。考虑控制表面的一个微元面积 $\displaystyle dA$，其外法线向量为 $\displaystyle \vec{n}$。流体内部的压力 $\displaystyle p$ 对这个微元面积施加的作用力是 $\displaystyle -p\vec{n}dA$ (负号表示压力作用方向与外法线相反，指向控制体内)。

当流体以速度 $\displaystyle \vec{v}$ 穿过这个微元面积时，压力对流体做的功的功率（即 $\displaystyle d\dot{W}_{norm}$）是力与速度的点积：
$$
\displaystyle d\dot{W}_{norm} = (-p\vec{n}dA) \cdot \vec{v} = -p(\vec{v} \cdot \vec{n})dA
$$
对整个控制表面积分，得到法向应力对控制体积内流体做功的总功率：
$$
\displaystyle \dot{W}_{norm} = \iint_{CS} -p(\vec{v} \cdot \vec{n})dA
$$
**然而**，在推导最终的能量方程时，我们通常不直接将 $\displaystyle \dot{W}_{norm}$ 放在 $\displaystyle \dot{W}$ 项中。这是因为这部分功与流体进出控制体积的行为密切相关，它更自然地与能量的对流项结合在一起。

让我们回顾一下能量方程的右侧，特别是通过控制表面的能量通量项：
$$
\displaystyle \iint_{CS}e\rho (\vec{v}\cdot \vec{n})dA = \iint_{CS}(\hat{u} + \frac{1}{2}v^{2} + gz)\rho (\vec{v}\cdot \vec{n})dA
$$
这一项代表了随流体质量流动而进出控制体积的内能、动能和势能。但是，流体要进入或离开控制体积，必须克服边界上的压力做功。这部分功被称为 **流功 (Flow Work)**。单位质量流体进出控制体积所伴随的流功是 $\displaystyle p/\rho$。

因此，通过控制表面的总能量输运率，不仅包括流体本身携带的能量 $\displaystyle e$，还包括了将其推入或推出控制体积所需的流功 $\displaystyle p/\rho$。我们将这两部分合并：
$$
\displaystyle \text{能量通量} + \text{流功通量} = \iint_{CS}(e + \frac{p}{\rho})\rho (\vec{v}\cdot \vec{n})dA
$$
注意到 $\displaystyle e + p/\rho = (\hat{u} + \frac{1}{2}v^2 + gz) + p/\rho = (\hat{u} + p/\rho) + \frac{1}{2}v^2 + gz$。我们定义 **焓 (Enthalpy)** $\displaystyle \hat{h} = \hat{u} + p/\rho$。于是，能量通量项可以优雅地写成：
$$
\displaystyle \iint_{CS}(\hat{h} + \frac{1}{2}v^{2} + gz)\rho (\vec{v}\cdot \vec{n})dA
$$
这样，法向应力做的功（流功）就被巧妙地包含在了使用焓计算的能量对流项中。

#### 2. 轴功 ($\displaystyle \dot{W}_{shaft}$)

**轴功** 是指通过旋转轴传递的机械功。当控制体积包围一个流体机械（如泵的叶轮、涡轮的转子）时，轴功代表了流体与外界通过该机械传递的功率。
*   对于泵或风机，外界对流体做功，$\displaystyle \dot{W}_{shaft}$ 为负值（能量输入控制体）。
*   对于涡轮，流体对外界做功，$\displaystyle \dot{W}_{shaft}$ 为正值（能量输出控制体）。

轴功是能量方程左侧 $\displaystyle \dot{W}$ 项中最主要的部分，通常也是唯一明确保留的部分。

#### 3. 剪切功 ($\displaystyle \dot{W}_{shear}$)

剪切功是由作用在控制表面上的切向应力（粘性剪切应力）所做的功。如果控制表面是固定的（例如管道壁），流体速度为零（无滑移条件），则剪切力不做功。如果控制表面本身在切向运动（例如，一个移动的带子穿过控制体积），或者在某些特殊情况下（例如，考虑流体微团变形），剪切功可能需要考虑。

在大多数宏观控制体分析中，尤其是在固定边界问题中，$\displaystyle \dot{W}_{shear}$ 通常为零或可以忽略。粘性效应的影响主要体现在将机械能转化为内能（耗散），这会反映在内能 $\displaystyle \hat{u}$ 或焓 $\displaystyle \hat{h}$ 的变化上，或者在简化方程中表示为“损失”项。

#### 4. 其他功 ($\displaystyle \dot{W}_{other}$)

这是一个概括性术语，包括所有其他形式的功传递，例如电磁力做功等。在典型的流体力学问题中，除非特别指出，$\displaystyle \dot{W}_{other}$ 通常为零。

### 整合能量方程

将上述对功的分析代入热力学第一定律应用于控制体的形式：
$$
\displaystyle \frac{dQ}{dt}-\dot{W}=\frac{\partial }{\partial t}\iiint_{CV} e \rho dV+\iint_{CS}e\rho (\vec{v}\cdot \vec{n})dA
$$
我们将 $\displaystyle \dot{W}$ 分解，并将流功部分移到右侧与能量通量合并：
$$
\displaystyle \dot{Q}_{CV} - (\dot{W}_{shaft} + \dot{W}_{shear} + \dot{W}_{other}) = \frac{\partial }{\partial t}\iiint_{CV} \rho e \, dV + \iint_{CS} \rho (e + \frac{p}{\rho}) (\vec{v} \cdot \vec{n}) dA
$$
使用焓 $\displaystyle \hat{h} = \hat{u} + p/\rho$ 和 $\displaystyle e = \hat{u} + \frac{1}{2}v^2 + gz$，最终得到常用的 **控制体积能量方程** 形式：
$$
\displaystyle \boxed{ \dot{Q}_{CV} - \dot{W}_{shaft} - \dot{W}_{shear} - \dot{W}_{other} = \frac{\partial }{\partial t}\iiint_{CV} \rho (\hat{u} + \frac{1}{2}v^2 + gz) dV + \iint_{CS} \rho (\hat{h} + \frac{1}{2}v^2 + gz) (\vec{v} \cdot \vec{n}) dA }
$$
在许多应用中，我们会忽略 $\displaystyle \dot{W}_{shear}$ 和 $\displaystyle \dot{W}_{other}$，方程简化为：
$$
\displaystyle \dot{Q}_{CV} - \dot{W}_{shaft} = \frac{\partial }{\partial t}\iiint_{CV} \rho (\hat{u} + \frac{1}{2}v^2 + gz) dV + \iint_{CS} \rho (\hat{h} + \frac{1}{2}v^2 + gz) (\vec{v} \cdot \vec{n}) dA
$$
这个形式是进行热流体分析的强大工具，可以进一步根据具体问题（如定常流动、不可压缩流动、绝热流动等）进行简化。



## 总结

有一些很装逼的名词给他们祛祛魅:

### 流体力学流动类型、特性及雷诺输运定理应用综合表

| 流动类型/条件 (Flow Type/Condition) | 简明描述 (Brief Description) | 关键物理特性/影响 (Key Physical Characteristics/Influence) | 雷诺数 ($\displaystyle Re = \frac{\rho VL}{\mu}$) 解读 (Reynolds Number Interpretation) | 关键准则数 (Key Dimensionless Numbers) | 雷诺输运定理 (RTT) 变体/应用侧重 (RTT Variant/Application Focus) |
|---|---|---|---|---|---|
| **通用流动 (General Flow)** | 无特殊简化，最普遍情况。 | 密度($\displaystyle \rho$), 速度($\displaystyle \mathbf{V}$), 强度性质($\displaystyle b$) 均可变；控制体(CV)可移动/变形。 | $\displaystyle Re$ 用于表征惯性力/粘性力比值，但需考虑参数变化。 | $\displaystyle Re, Ma, Fr, We, St$ 等，取决于具体问题。 | **完整形式**: $\displaystyle \frac{d(B_{sys})}{dt} = \frac{\partial}{\partial t} \int_{CV} (\rho b \, dV) + \int_{CS} (\rho b \mathbf{V}_r \cdot \mathbf{n}) \, dA$ <br> (适用于推导所有守恒律的基础) |
| **固定控制体 (Fixed Control Volume)** | 控制体在空间中位置和形状不变。 | CV 几何固定。 | $\displaystyle Re$ 计算基于固定几何尺寸 $\displaystyle L$。 | 取决于具体流动类型。 | **简化 $\displaystyle \mathbf{V}_r$**: $\displaystyle \mathbf{V}_r = \mathbf{V}$ (流体绝对速度)。<br> $\displaystyle \frac{d(B_{sys})}{dt} = \frac{\partial}{\partial t} \int_{CV} (\rho b \, dV) + \int_{CS} (\rho b \mathbf{V} \cdot \mathbf{n}) \, dA$ <br> (大多数工程分析的基础形式) |
| **不可压缩流 (Incompressible Flow)** | 流体密度 $\displaystyle \rho$ 基本不变。 | $\displaystyle \rho = \text{常数}$。 | $\displaystyle Re$ 公式中 $\displaystyle \rho$ 为常数。 | $\displaystyle Re$ (主导动力相似), $\displaystyle Ma \ll 1$ (通常 $\displaystyle Ma < 0.3$)。 | **提出常数 $\displaystyle \rho$**: $\displaystyle \frac{d(B_{sys})}{dt} = \rho \frac{\partial}{\partial t} \int_{CV} (b \, dV) + \rho \int_{CS} (b \mathbf{V}_r \cdot \mathbf{n}) \, dA$ <br> (应用: 导出体积守恒 $\displaystyle \int_{CS} (\mathbf{V} \cdot \mathbf{n}) \, dA = 0$ [若定常+固定CV]) |
| **可压缩流 (Compressible Flow)** | 流体密度 $\displaystyle \rho$ 发生显著变化。 | $\displaystyle \rho = \text{变量}$, $\displaystyle T, p$ 重要。 | $\displaystyle Re$ 公式中 $\displaystyle \rho$ 是变量 (局部或参考值)。 | $\displaystyle Ma$ (关键), $\displaystyle Re, Pr, \gamma$。 | **无密度简化**: RTT 形式不变，但积分内 $\displaystyle \rho$ 需作为变量处理。<br> (应用: 高速气体动力学，需结合能量方程) |
| **定常流 (Steady Flow)** | 流场参数不随时间变化。 | $\displaystyle \frac{\partial}{\partial t} = 0$ 对所有流体属性。 | $\displaystyle Re$ 公式中 $\displaystyle V$ 为恒定速度。 | $\displaystyle Re, Ma, Fr, We$ (取决于问题), $\displaystyle St = 0$。 | **时间导数项为零**: $\displaystyle \frac{\partial}{\partial t} \int_{CV} (\rho b \, dV) = 0$。<br> $\displaystyle \frac{d(B_{sys})}{dt} = \int_{CS} (\rho b \mathbf{V}_r \cdot \mathbf{n}) \, dA$ <br> (应用: 稳态质量、动量、能量平衡) |
| **非定常流 (Unsteady Flow)** | 流场参数随时间变化。 | $\displaystyle \frac{\partial}{\partial t} \neq 0$。 | $\displaystyle Re$ 可为瞬时值 $\displaystyle Re(t)$ 或基于平均速度 $\displaystyle \bar{V}$。 | $\displaystyle St$ (关键), $\displaystyle Re, Ma, Fr, We$。 | **保留时间导数项**: $\displaystyle \frac{\partial}{\partial t} \int_{CV} (\rho b \, dV) \neq 0$。<br> 完整 RTT 或固定 CV 形式适用。<br> (应用: 启动/停止过程、涡街脱落、波动) |
| **层流 (Laminar Flow)** | 流体分层流动，混合弱。 | 粘性力主导，流动有序。 | $\displaystyle Re < Re_{crit}$ (临界雷诺数)，用于判断流态。 | $\displaystyle Re$ (关键判据), $\displaystyle f = \frac{64}{Re}$ (圆管)。 | RTT 本身形式不变，但 $\displaystyle \mathbf{V}$ 场平滑规则。常结合稳态、不可压缩假设推导精确解（如Hagen-Poiseuille）。 |
| **湍流 (Turbulent Flow)** | 流体运动混乱，混合强。 | 惯性力主导，流动随机脉动。 | $\displaystyle Re > Re_{crit}$，用于判断流态 (常基于平均速度 $\displaystyle \bar{V}$)。 | $\displaystyle Re$ (关键判据), 相对粗糙度 $\displaystyle \frac{\epsilon}{D}$ (影响摩擦)。 | RTT 应用于瞬时量复杂。常对 RTT 进行**时间平均** (RANS)，导出含雷诺应力项的平均流方程。 |
| **粘性流 (Viscous Flow)** | 考虑流体粘度 $\displaystyle \mu$。 | $\displaystyle \mu \neq 0$, 存在内摩擦和边界层。 | $\displaystyle Re$ 公式直接体现粘性影响 ($\displaystyle \mu$ 在分母)。 | $\displaystyle Re$ (核心), $\displaystyle Pr$ (若有传热)。 | 通用 RTT 适用。是推导 Navier-Stokes 方程 (微分形式) 或积分动量方程的基础。 |
| **无粘流 (Inviscid Flow)** | 忽略流体粘度 $\displaystyle \mu$。 | $\displaystyle \mu \approx 0$, 无内摩擦，允许滑移。 | $\displaystyle Re \to \infty$，公式不用于量化粘性。 | $\displaystyle Eu$ (或 $\displaystyle C_p$), $\displaystyle Ma$。 | RTT 中可设粘性力为零。应用 RTT (动量) 可导出 Euler 方程。常结合伯努利方程分析。 |
| **入口/出口均匀流 (Uniform Flow at Inlets/Outlets)** | 在控制表面入口/出口处性质和速度均匀。 | $\displaystyle \rho, b, V_n$ 在界面上为常数。 | $\displaystyle Re$ 计算常使用该均匀速度 $\displaystyle V$。 | 取决于具体流动类型。 | **简化通量积分**: $\displaystyle \int_{CS} (\rho b \mathbf{V}_r \cdot \mathbf{n}) \, dA = \sum (\rho b V_n A)_{out} - \sum (\rho b V_n A)_{in}$ <br> (极大简化工程计算，常与其他假设联用) |

### 由雷诺输运定理 (RTT) 导出的主要守恒方程

| 替换的广延变量 ($\displaystyle B_{sys}$) | 对应的强度量 ($\displaystyle b = B/m$) | 系统变化率 ($\displaystyle d(B_{sys})/dt$) / 守恒性 | 导出公式名称 | 特殊公式/形式? | 适用范围 | 考试一般怎么使用 |
|---|---|---|---|---|---|---|
| **质量 (Mass)** <br> $\displaystyle m$ | $\displaystyle 1$ | $\displaystyle \frac{d(m_{sys})}{dt} = 0$ <br> (系统质量守恒) | **连续性方程 (积分形式)** <br> (Continuity Equation - Integral Form) <br> $\displaystyle \frac{\partial}{\partial t} \int_{CV} \rho \, dV + \int_{CS} (\rho \mathbf{V} \cdot \mathbf{n}) \, dA = 0$ | **基础方程** <br> 常见简化: <br> - 定常: $\displaystyle \int_{CS} (\rho \mathbf{V} \cdot \mathbf{n}) \, dA = 0$ <br> - 定常+不可压: $\displaystyle \int_{CS} (\mathbf{V} \cdot \mathbf{n}) \, dA = 0$ <br> - 定常+不可压+均匀出入口: $\displaystyle \sum Q_{out} = \sum Q_{in}$ | **通用**，适用于所有流体流动。 | **非常频繁**。建立流量/速度关系，求解未知速度或截面积，作为动量/能量分析的基础。检查质量是否平衡。 |
| **线性动量 (Linear Momentum)** <br> $\displaystyle m\mathbf{V}$ | **速度矢量** <br> $\displaystyle \mathbf{V}$ | $\displaystyle \frac{d(m\mathbf{V})_{sys}}{dt} = \sum \mathbf{F}_{sys}$ <br> (牛顿第二定律) | **线性动量方程 (积分形式)** <br> (Linear Momentum Equation - Integral Form) <br> $\displaystyle \sum \mathbf{F}_{on CV} = \frac{\partial}{\partial t} \int_{CV} (\rho \mathbf{V} \, dV) + \int_{CS} (\rho \mathbf{V} (\mathbf{V} \cdot \mathbf{n})) \, dA$ | **基础方程** <br> 常见简化 (定常+均匀出入口): <br> $\displaystyle \sum \mathbf{F}_{on CV} = \sum (\dot{m} \mathbf{V})_{out} - \sum (\dot{m} \mathbf{V})_{in}$ | **通用**。用于计算流体对固体边界的作用力（或反作用力）。 | **非常频繁**。计算管道弯头、异径管、喷嘴、导流叶片等受力；计算射流冲击力；分析飞行器推力。需仔细定义CV并分析所有力（压力、重力、粘性力、支撑反力）。 |
| **角动量 / 动量矩 (Angular Momentum / Moment of Momentum)** <br> $\displaystyle \mathbf{r} \times m\mathbf{V}$ | **速度的矩** <br> $\displaystyle \mathbf{r} \times \mathbf{V}$ | $\displaystyle \frac{d(\mathbf{r} \times m\mathbf{V})_{sys}}{dt} = \sum \mathbf{M}_{sys}$ <br> (角动量定理) | **角动量方程 (积分形式)** <br> (Angular Momentum Equation - Integral Form) <br> $\displaystyle \sum \mathbf{M}_{on CV} = \frac{\partial}{\partial t} \int_{CV} \rho (\mathbf{r} \times \mathbf{V}) \, dV + \int_{CS} \rho (\mathbf{r} \times \mathbf{V}) (\mathbf{V} \cdot \mathbf{n}) \, dA$ | **基础方程** <br> 常见简化 (定常+均匀出入口): <br> $\displaystyle \sum \mathbf{M}_{on CV} = \sum (\dot{m} (\mathbf{r} \times \mathbf{V}))_{out} - \sum (\dot{m} (\mathbf{r} \times \mathbf{V}))_{in}$ | **通用**。特别适用于分析旋转机械或有转矩作用的流动。 | **较常见**，尤其在涉及泵、涡轮、风机、搅拌器、旋转喷头等问题时。计算所需的扭矩、轴功率 ($\displaystyle P = T\omega$)。 |
| **能量 (Energy)** <br> $\displaystyle E = m(\hat{u} + \frac{V^2}{2} + gz)$ | **单位质量能量** <br> $\displaystyle e = \hat{u} + \frac{V^2}{2} + gz$ | $\displaystyle \frac{dE_{sys}}{dt} = \dot{Q}_{net,in} - \dot{W}_{net,out}$ <br> (热力学第一定律) | **能量方程 (积分形式)** <br> (Energy Equation - Integral Form) <br> (常用焓形式: $\displaystyle \hat{h} = \hat{u} + p/\rho$) <br> $\displaystyle \dot{Q}_{CV} - \dot{W}_{shaft} = \frac{\partial}{\partial t} \int_{CV} \rho e \, dV + \int_{CS} \rho (\hat{h} + \frac{V^2}{2} + gz) (\mathbf{V} \cdot \mathbf{n}) \, dA$ | **基础方程** <br> **相关特殊形式**: <br> 1. **含损失能量方程** (定常, 不可压, $\displaystyle \alpha$为动能修正系数): <br> $\displaystyle (\frac{p}{\rho g} + \frac{\alpha V^2}{2g} + z)_{1} + h_{P} = (\frac{p}{\rho g} + \frac{\alpha V^2}{2g} + z)_{2} + h_{T} + h_{L}$ <br> 2. **伯努利方程 (Bernoulli Eq.)**: 能量方程在**定常、不可压、无粘、无轴功、无热传递**条件下的**沿流线**简化形式 (或由动量方程导出): <br> $\displaystyle \frac{p}{\rho} + \frac{V^2}{2} + gz = \text{常数 (沿流线)}$ | **通用** (能量方程本身)。 <br> 含损失能量方程广泛用于**管流**分析。 <br> 伯努利方程适用范围**严格受限**于其假设条件。 | **频繁**。 <br> - **能量方程**: 计算热传递、轴功、温变、考虑压缩性的流动。 <br> - **含损失能量方程**: 计算管路系统中的压力损失、所需泵扬程、水轮机输出功率。 <br> - **伯努利方程**: 用于理想流（无粘、不可压）区域的快速估算，如流线不同点间的压力-速度关系，测速管原理，翼型升力估算。**注意严格判断适用条件**。 |