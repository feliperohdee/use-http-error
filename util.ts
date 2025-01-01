const toNumber = (str: string | null, defaultValue: number = 0) => {
	if (str === null || str === undefined) {
		return defaultValue;
	}

	const n = Number(str);

	if (!Number.isFinite(n)) {
		return defaultValue;
	}

	return n;
};

export default {
	toNumber
};
