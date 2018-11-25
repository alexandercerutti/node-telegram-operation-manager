import { OperationManager } from "..";
import "jasmine";

describe("Operation Manager", () => {
	let opm: OperationManager;

	beforeEach(() => {
		opm = new OperationManager();
	});

	it("Registers an action", () => {
		opm.register("001", "test1");

		expect(opm.hasActive("001")).toBe(true);
	});

	it("Ending one of one action", () => {
		opm.register("001", "test1");

		opm.end("001");

		expect(opm.onGoing("001").length).toBe(0);
	});

	it("Ending one of two actions without name", () => {
		opm.maxConcurrent = 2;
		opm.register("001", "test1");
		opm.register("001", "test2");

		opm.end("001");

		expect(opm.onGoing("001")[0].command).toBe("test2");
	});

	it("Ending one of two actions with name", () => {
		opm.maxConcurrent = 2;
		opm.register("001", "test1");
		opm.register("001", "test2");

		opm.end("001", "test2");

		expect(opm.onGoing("001")[0].command).toBe("test1");
	});

	it("Testing operation exceeding", () => {
		opm.maxConcurrent = 2;
		opm.register("001", "test1");
		opm.register("001", "test2");
		opm.register("001", "test3");

		expect(opm.onGoing("001").length).toBe(2);
	});

	it("Wipes out 001's queue.", () => {
		opm.maxConcurrent = 4;
		opm.register("001", "test1");
		opm.register("001", "test2");
		opm.register("001", "test3");
		opm.register("001", "test4");

		opm.empty("001");

		expect(opm.onGoing("001").length).toBe(0);
	});
});
