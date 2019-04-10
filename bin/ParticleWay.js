/**
 * 中間点の座標の算出が可能な経路を表すクラス
 */
export class ParticleWay {
    /**
     * コンストラクタ
     * @param points 経路を表す座標の配列。各座標は要素2なら2次元パス、要素3なら3次元パスとして扱われる。
     */
    constructor(points) {
        this.name = "";
        this.setPoints(points);
    }
    /**
     * 経路の座標配列を更新する。
     * @param points
     */
    setPoints(points) {
        this._points = points;
        if (this._points.length === 0) {
            console.warn("ParticleWay : 長さゼロの配列が指定されました。座標が算出できないため、getPoint関数は常にnullを返します。");
        }
        if (this._points.length === 1) {
            console.warn("ParticleWay : 長さ1の配列が指定されました。座標が算出できないため、getPoint関数は常に固定の座標を返します。");
        }
        const sumTable = new Array(this._points.length).fill(0);
        this._points.forEach((val, index, array) => {
            if (index === 0)
                return;
            sumTable[index] =
                this.getDistance(array[index - 1], val) + sumTable[index - 1];
        });
        const total = sumTable[sumTable.length - 1];
        this._ratioTable = sumTable.map(val => {
            return val / total;
        });
    }
    /**
     * 2点間の距離を取得する。
     * @param pos1
     * @param pos2
     */
    getDistance(pos1, pos2) {
        const dx = pos2[0] - pos1[0];
        const dy = pos2[1] - pos1[1];
        switch (pos1.length) {
            case 3:
                const dz = pos2[2] - pos1[2];
                return Math.sqrt(dx * dx + dy * dy + dz * dz);
            case 2:
                return Math.sqrt(dx * dx + dy * dy);
        }
    }
    /**
     * 経路上の中間点座標を取得する。
     * @param t 算出する座標の位置。0.0(始点) ~ 1.0(終点)の間。
     */
    getPoint(t) {
        if (!this._points || this._points.length === 0) {
            return null;
        }
        if (this._points.length === 1) {
            return [...this._points[0]];
        }
        const n = this._points.length;
        t = Math.min(t, 1.0);
        if (t === 1.0)
            return [...this._points[n - 1]];
        t = Math.max(t, 0.0);
        if (t === 0.0)
            return [...this._points[0]];
        let i = 1;
        for (i; i < n; i++) {
            if (this._ratioTable[i] >= t)
                break;
        }
        i--;
        const floorPoint = this._points[i];
        const ceilPoint = this._points[i + 1];
        const ratioBase = this._ratioTable[i];
        return this.getCenterPoint(floorPoint, ceilPoint, (t - ratioBase) / (this._ratioTable[i + 1] - ratioBase));
    }
    /**
     * 線分上の中間点座標を取得する
     * @param pos1 線分の始点
     * @param pos2 線分の終点
     * @param t 算出する座標の位置。0.0(始点) ~ 1.0(終点)の間。
     */
    getCenterPoint(pos1, pos2, t) {
        const rt = 1.0 - t;
        let pos = [pos1[0] * rt + pos2[0] * t, pos1[1] * rt + pos2[1] * t];
        switch (pos1.length) {
            case 3:
                pos.push(pos1[2] * rt + pos2[2] * t);
                return pos;
            case 2:
                return pos;
        }
    }
}
