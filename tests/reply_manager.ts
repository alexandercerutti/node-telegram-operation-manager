import { ReplyManager } from "..";
import "jasmine";

describe("test1", () => {
	let reply;

	beforeEach(() => {
		reply = new ReplyManager();
	});

	it("Registers a new action", () => {
		reply.register("001", () => {
			console.log("test 1 for push");
		});

		expect(reply.pending("001").length).toBe(1);
	});

	it("Expects replies", () => {
		reply
			.register("001", () => {
				console.log("test 1 for register reply");
			})
			.register("001", () => {
				console.log("test 2 for register reply");
			})

		expect(reply.expects("001")).toBe(true);
	});

	it("Will execute a reply", () => {
		reply
			.register("001", () => {
				// doing nothing to show nothing in the console.
			})
			.register("001", () => {
				// doing nothing to show nothing in the console.
				// only this should remain
			})

		reply.execute("001", {});

		expect(reply.pending("001").length).toBe(1);
	});

	it("Removes all the actions", () => {
		reply
			.register("001", () => {
				// doing nothing to show nothing in the console.
			})
			.register("001", () => {
				// doing nothing to show nothing in the console.
				// only this should remain
			})
			.cancelAll("001");

		expect(reply.pending("001").length).toBe(0);
	});

	it("Pops out the last element", () => {
		reply
			.register("001", () => {
				// doing nothing to show nothing in the console.
			})
			.register("001", () => {
				// doing nothing to show nothing in the console.
				// only this should remain
			});

		reply.pop("001");

		expect(reply.pending("001").length).toBe(1);
	});
});
