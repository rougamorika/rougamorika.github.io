# 关于第一次数学培训的总结

## p 级数

### 调和级数不收敛

#### 奇偶法

下面的级数称之为**p 级数**

$$
\sum_{n=1}^{\infty} \frac{1}{n^s} = 1 + \frac{1}{2^s} + \frac{1}{3^s} + \cdots + \frac{1}{n^s} + \cdots
$$

不过有一点我们*欺骗*了大家,其实它的完全体是:

$$
\zeta(s)=\sum_{n=1}^{\infty} \frac{1}{n^s} = 1 + \frac{1}{2^s} + \frac{1}{3^s} + \cdots + \frac{1}{n^s} + \cdots
$$

称之为**黎曼$\zeta$函数**

首先我们考虑调和级数:

$$
\sum_{n=1}^{\infty} \frac{1}{n}
$$

假设我们能使它收敛到一个值$A$,那么我们可以拆分上面的级数为下面两个级数

$$
\sum_{n=1}^{\infty} \frac{1}{2n-1}+\sum_{n=1}^{\infty} \frac{1}{2n}
$$

我们将后者提出一个$\frac{1}{2}$来:

$$
\sum_{n=1}^{\infty} \frac{1}{2n-1}+\frac{1}{2}\sum_{n=1}^{\infty} \frac{1}{n}
$$

假设前面的级数的收敛值为$A'$,因为每一个奇数项都大于对应的偶数项,自然

$$
A'> \frac{A}{2}
$$

所以根据收敛级数的四则运算规则

$$
A'+\frac{A}{2}>A
$$

所以奇数项与偶数项的和的收敛值必然比$A$来的大,这和我们假设$A$是调和级数的收敛值是矛盾的,因此,**调和级数不收敛**.

!!! ad-note "关于调和级数的补充"
事实上,$\zeta(s)$是一个复值函数,由于我们上面的讨论,实质上不存在$\zeta(1)$

#### 2 幂次拆分法

事实上,我们利用下面的关系

$$
\frac{1}{n+1}+\frac{1}{n+2}+\frac{1}{n+3}\cdots +\frac{1}{2n}\geq\frac{n}{2n}=\frac{1}{2}
$$

此时实质上揭示了调和级数每一个夹在 2 幂次之间的分母之间的分数的和总是大于$\frac{1}{2}$
因而对调和级数作$2^{k}$幂次拆分(这种拆分可以作无数次,所以就有$k\to \infty$),就可以得出:

$$
H_{2n}\geq\frac{k}{2}(k\to \infty)
$$

这已经上无界了,肯定不收敛.

### p 级数的敛散性

#### s<1 的情况

对于$s<1$的情况,我们对每一个$n$,都有:

$$
\frac{1}{n^{s}}>\frac{1}{n}
$$

利用级数比较,我们自然可以得到此时依然发散.

#### s>1 的情况

我们同样使用二幂次拆分,假设$s=1+\sigma$,

$$
\frac{1}{(n+1)^{\sigma}}+\frac{1}{(n+2)^{\sigma
}}+\frac{1}{(n+3)^{\sigma
}}\cdots +\frac{1}{(2n)^{\sigma
}}\geq\frac{n}{n^{s
}}=\frac{1}{n^{\sigma}}
$$

现在去掉前两项作二幂次拆分,自然地
我们有后面作为等比级数:

$$
\frac{1}{3^s} + \frac{1}{4^s}; \frac{1}{5^s} + \frac{1}{6^s} + \frac{1}{7^s} + \frac{1}{8^s}; \frac{1}{9^s} + \cdots + \frac{1}{16^s}; \cdots; \frac{1}{(2^{k-1} + 1)^s} + \cdots + \frac{1}{(2^k)^s}; \cdots
$$

由于$s=1+\sigma$,所以他们一定小于对应的$\sigma$几何级数:

$$
\frac{1}{3^\sigma} + \frac{1}{4^\sigma} + \frac{1}{5^\sigma} + \frac{1}{6^\sigma} + \frac{1}{7^\sigma} + \frac{1}{8^\sigma} + \frac{1}{9^\sigma} + \cdots + \frac{1}{16^\sigma} + \cdots + \frac{1}{(2^{k-1} + 1)^\sigma} + \cdots + \frac{1}{(2^k)^\sigma} + \cdots
$$

自然地,我们有上面的级数和小于下面的表达式

$$
L=1+\frac{1}{2^s}+\frac{\frac{1}{2^\sigma}}{1-\frac{1}{2^\sigma}}
$$

所以级数是收敛的.

**p 级数是一个很有用的比较级数.**

## 关于题单上的习题

### A2-1

$$
 \sum_{n=1}^{\infty} \frac{1}{3^{\log(n)}}
$$

这题不难,关键是它不长$p$级数的样子,得把它化过去.
注意到:

$$
3^{\log(n)}=\exp(\log(3)\cdot\log(n))=\exp(\log(n)\cdot\log(3))=n^{\log(3)}
$$

所以上面的级数就等价于:

$$
\sum_{n=1}^{\infty} \frac{1}{n^{\log(3)}}
$$

那么这就是我们上面讲过的幂级数,由于$\log(3)>1$.
因此,我们有原级数收敛.

### A2-2

$$
\sum_{n=2}^{\infty} \frac{1}{(\log n)^{\log n}}
$$

这题和上面的有嘛区别,无非化成

$$
\sum_{n=2}^{\infty} \frac{1}{{n}^{\log(\log n)}}
$$

那实际上我们就是看$\log(\log n)$的情况

首先,我们注意到$n$一定是比$\log(\log n)$更高阶的无穷大,所以我们考虑其与$n^{2}$的关系,注意到对于极限做分析

$$
\lim_{n\to \infty}\frac{n^{2}}{n^{\log\log n}}
$$

上面的极限一定为 0,如果你注意不到,我们可以这么玩一下:

$$
\lim_{n\to \infty}n^{2-\log(n)}
$$

当$n\to +\infty$时,自然有$2-\log(n)\to -\infty$,即自然的我们在求

$$
n^{-\infty}
$$

的极限.这看起来是一个不定形,但是实际上我们对它进行一定的变形,变为

$$
\lim_{n\to \infty} \exp(\log(n)\cdot(2-\log(n)))=\exp(2\log(n)-\log^{2}(n))
$$

由于此时内部的式子是平方项目占主导,变成负无穷,极限化成

$$
\lim_{n\to \infty} \exp(-\infty)=0
$$

所以$n^{2}$的增长是不如$n^{\log\log n}$的,因而我们认为 $\displaystyle\sum_{n=2}^{\infty} \frac{1}{(\log n)^{\log n}}$ 是一个比 $\displaystyle\sum_{n=2}^{\infty} \frac{1}{n^{2}}$ 还要更弱的级数,后者已然是收敛的,自然前者也一定收敛啦.

### A2-3

$$
\sum_{n=3}^{\infty} \frac{1}{(\log n)^{\log \log n}}
$$

我们发现上面的交换形式不起作用,现在我们借着这个题目做一下含指对级数的处理,无非下列两种

- 交换指数中真数和底数
- 换底
- **$e^{\log a}$型代换**

我们发现换底带来不必要的麻烦(换成 10 那么级数的式子反而变得更复杂),交换真数和底数不改变式子的结构,相当于什么都没做,所以只能先尝试写成$e^{\log a}$的结构,即

$$
\sum_{n=3}^{\infty} \frac{1}{\exp((\log \log n)^{2})}
$$

我们希望吧二次嵌套的$\log\log$可以被化简为一次的,这样可以将$\exp$函数消去把真数脱出来分析,因而,我们现在要比较$(\log\log(n))^2$和$\log(n)$的关系.
自然地,我们就去讨论

$$
\lim_{n\to \infty} \frac{(\log\log(n))^2}{\log(n)}
$$

求一次导数

$$
2\lim_{n\to \infty} \frac{\log\log(n)}{\log(n)}
$$

上下再求一次导数

$$
2\lim_{n\to \infty} \frac{\frac{1}{n\log n}}{\frac{1}{n}}=2\lim_{n\to \infty}\frac{1}{\log(n)}=0
$$

所以可以认为当$n$充分大的时候

$$
\exp((\log\log(n))^2)<\exp(\log(n))=n
$$

所以可以认为,$\displaystyle\sum_{n=3}^{\infty}\frac{1}{\exp((\log\log(n))^2)}$是一个比$\displaystyle\sum_{n=3}^{\infty}\frac{1}{n}$还要强的级数,后者已然发散,前者必然发散.
