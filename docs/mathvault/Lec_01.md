# 关于常数项级数的题单(20250316)

## A:p 级数之美

### A1:P 级数的敛散性

讨论p级数:

$$
\sum^{\infty}_{n=1}\frac{1}{n^{p}}
$$

的敛散性.

### A2:对数天堂

利用上面的关于**p 级数**的讨论,尝试审敛下列级数:

1. \[\sum_{n=1}^{\infty} \frac{1}{3^{\ln n}}\]
2. \[\sum_{n=2}^{\infty} \frac{1}{(\ln n)^{\ln n}}\]
3. \[\sum_{n=3}^{\infty} \frac{1}{(\ln n)^{\ln \ln n}}\]

### A3:p 级数和极限还有一腿?

尝试计算:
$$
\lim_{n \to \infty} \left( \frac{1}{p^{n+1}} + \frac{1}{p^{n+2}} + \cdots + \frac{1}{p^{2n}} \right),p > 1
$$

## B:比一比有益身体健康

### B1:先比再说

利用对正项级数的**比较审敛法**,尝试对下列级数审敛:

1. \[\sum_{n=1}^{\infty} \left[ \frac{(2n-1)!!}{(2n)!!} \right]^k\]
2. \[\sum_{n=1}^{\infty} n! \left( \frac{a}{n} \right)^n ,a > 0\]
3. \[\sum_{n=1}^{\infty} \left[ e - \left( 1 + \frac{1}{n} \right)^n \right]\]

### B2:兄弟姐妹

如下是常见的关于比较判别法的变式,尝试证明一下吧!假定$a_{n}$是**正项级数**.

1. (**Cauchy根值判别法**)若\[\lim_{n \to \infty} \sqrt[n]{a_n} = c\]
则:$c<1$时级数收敛,$c>1$时级数发散.
2. (**比值判别法**)
   1. (**D'lambert 判别法**)若\[\lim_{n \to \infty} \frac{a_{n+1}}{a_n} = d
\] 则:$d<1$时级数收敛,$d>1$时级数发散.
   2. (**Raabe 判别法**)若\[\lim_{n \to \infty} n \left( \frac{a_n}{a_{n+1}} - 1 \right) = r\] 则:$r>1$时级数收敛,$r<1$时级数发散.
   3. (**Bertrand 判别法**)若\[\lim_{n \to \infty} \ln n \left[ n \left( \frac{a_n}{a_{n+1}} - 1 \right) - 1 \right] = b.\]则:$b>1$时级数收敛,$b<1$时级数发散.
   4. (**Gauss 判别法**)若\[\frac{a_n}{a_{n+1}} = 1 + \frac{\mu}{n} + O\left(\frac{1}{n^{1+\varepsilon}}\right), \varepsilon > 0\] 则:$\mu>1$时级数收敛,$\mu\leq 1$时级数发散.

