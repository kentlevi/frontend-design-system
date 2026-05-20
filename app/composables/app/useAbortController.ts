export const useAbortController = () => {
	let latest_request_id = 0
	let active_request_controller: AbortController | null = null

	function startRequest() {
		active_request_controller?.abort('Canceled due to newer request.')

		const request_id = ++latest_request_id
		const controller = new AbortController()
		active_request_controller = controller

		return { request_id, controller }
	}

	function releaseController(controller: AbortController) {
		if (active_request_controller === controller) {
			active_request_controller = null
		}
	}

	function isLatestRequest(request_id: number) {
		return request_id === latest_request_id
	}

	return {
		startRequest,
		releaseController,
		isLatestRequest,
	}
}
