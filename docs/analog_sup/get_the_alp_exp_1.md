# 求解三极管电路的参数(1):$\alpha$和$\beta$

## 题干

![alt text](image.png)

给定上述的电路图,已测的$V_{B}=+1.0\text{V}$,$V_{E}=+1.7\text{V}$,求三极管的放大倍数$\beta$和共基电流传输系数$\alpha$,并求此时的集电极电压$V_{C}$

## 解答

给定的管制是一个PNP管,这其实和NPN管分析起来完全没区别.  

因为已经给定$V_{B}=+1.0\text{V}$,自然可以得到
$$
i_{b}=\frac{V_{B}}{R}=\frac{1 \text{V}}{100\text{k}\Omega}=0.01\text{mA}
$$

由于我们知道$V_{E}$,因此便可以得到

$$
i_{E}=\frac{V_{+cc}-V_{E}}{R_{e}}=\frac{10-1.7}{5\text{k}\Omega}=1.66\text{mA}
$$
因此可得到$\beta,\alpha$
$$
\beta=\frac{i_{E}}{i_{B}}=166
$$
$$
\alpha=\frac{\beta+1}{\beta}=\frac{167}{166}
$$

