# PN结习题包

如下习题绝大多数出自上海理工大学新手小牛老师的[模拟电子技术视频](https://www.bilibili.com/video/BV1gtAJeTEsr/?spm_id_from=333.1387.collection.video_card.click&vd_source=c30c56b3fc12ea3898ae570eb1baddfd),这是一份非常好的视频,帮助了博主良多,希望大家前去投币点赞三联.
其余的题目选自[Sedra](https://www.amazon.com/-/zh/dp/0190853506/ref=sr_1_1?__mk_zh_CN=%E4%BA%9A%E9%A9%AC%E9%80%8A%E7%BD%91%E7%AB%99&dib=eyJ2IjoiMSJ9.nBFMcFKkRdigkg5lA-t1r-EhBA-qckrxH0MMpupfQAoWPnTpA6WMtnbO_Duijpg6ewmblzQnmidEeR05a0gsbWUJqFINqm22Ud_wgP4o7S8bxE3GZrntxXbA4HBLtp4WA4uP4ZdvFEHg9dzP_FuR15CeTMmulVPRfkXidI4xRvPgtuKUGCe4B7MbBplCQN8N38G81Fbov6lwFdUUI3uiN15CYz-PhPGtJJ7CONYoIUo.c3py5O1Bp-hhvsG0XUAEq523kxYWPJgGu2z3bnEsRyQ&dib_tag=se&keywords=Microelectronic+Circuits&qid=1741930734&s=books&sr=1-1)和[Razavi](https://www.amazon.com/-/zh/dp/1119695147/ref=sr_1_2?__mk_zh_CN=%E4%BA%9A%E9%A9%AC%E9%80%8A%E7%BD%91%E7%AB%99&crid=1CLNK0XZQESOR&dib=eyJ2IjoiMSJ9.D8h0J1N4E3TpxB517ww1jAmbCssnjDrOnGGtYko-z3MXCZErD6xCm5ERLHVLrPUk8wuNqagkbTR9FU2fnjdlSaOWR-LfVpySFK_4RSJGcADgY7oFEvpJVCWdSztmkcruUniZqyCSwW_3XhY31aByG983VJX7BTys0oKMUREKLMBgeb-xzdwmL_GP0MUoev6DSOnlEI7Oy1jLOuLBB_YMvCIHTAqty7ADntrRGTsB8NI.C-hlEyNMQuU3T_Epdz40yvFoboHplFXX5dBgKYDkX6I&dib_tag=se&keywords=Razavi&qid=1741930763&s=books&sprefix=ra%2Cstripbooks-intl-ship%2C732&sr=1-2)两本教材,也很好,之后不再赘述.

## 判断题

### 题干

1. N型半导体可以通过在纯净半导体中掺杂$\ce{B^{+3}}$来实现.
2. 在P型半导体中大量掺$\ce{P^{+5}}$可以将它改为N型半导体.
3. P型半导体带正电,N型半导体带负电.
4. PN结内的漂移电流是少数载流子在内电场作用形成的.
5. 由于PN结交界面两边存在电位差,当把所示PN结两端两端短路就会有电流通过
6. PN结方程(肖克利方程)不仅描述了PN结的正向/方向特性,还描述了其击穿特性

### 答案(标黄的部分表示这题笔者错过)

1. ==错的,应该掺五价的$\ce{P^{+5}}$==
2. 和上面的那题是一样的,但是这样的掺杂是对的,对的
3. 所有的掺杂半导体都不带电,错的
4. ==在外电场的作用下,少子漂移,多子扩散,对的==
5. ==错的,不带电的==,PN结**只能在外加偏置的情况下表现压差**,其他情况均处于平衡肯定不带电,**PN结不是电源**
6. 错的,没有描述击穿特性.

## 选择题

1. 在杂质半导体中,多数载流子的浓度主要取决于(),而少数载流子的浓度与()十分密切?
   1. 温度
   2. 掺杂工艺
   3. 掺杂浓度
2. 随着温度的升高,在杂质半导体中,少数载流子的浓度(),多数载流子的浓度()?
   1. 明显升高
   2. 明显降低
   3. 基本不变
3. ==设某二极管的反向电压为$10\text{V}$,反向电流为$0.1\mu\text{A}$,在反向电压保持不变的情况下,当二极管的结温度下降$10 ^\circ\text{C}$时,反向电流约为??()==
   1. $0.01\mu\text{A}$
   2. $0.05\mu\text{A}$
   3. $0.1\mu\text{A}$
   4. $0.2\mu\text{A}$

### 答案

1. 多子取决于掺杂,少子取决于温度,选3,1
2. 因为少子的浓度和温度有关,所以选1,3
3. 不知道的公式: 

$$
I_{s}(T)=I_{s}(T_{0})2^{\frac{T-T_{0}}{10}}
$$

所以温度每降$10 ^\circ\text{C}$,那么我们的电流就变为原来的一半,所以选2.

