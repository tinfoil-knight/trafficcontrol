/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ResponseProfile } from "trafficops-types";

import { APIService } from "./base-api.service";

/**
 * Shared mapping function for converting Profile 'lastUpdated' fields to
 * actual dates, as well as the `lastUpdated` property of any and all
 * constituent Parameters thereof.
 *
 * @param p The Profile being converted.
 * @returns the converted Profile.
 */
function profileMap(p: ResponseProfile): ResponseProfile {
	return {
		...p,
		lastUpdated: new Date((p.lastUpdated as unknown as string).replace("+00", "Z"))
	};
}

/**
 * ProfileService exposes API functionality related to Profiles.
 */
@Injectable()
export class ProfileService extends APIService {

	/**
	 * Injects the Angular HTTP client service into the parent constructor.
	 *
	 * @param http The Angular HTTP client service.
	 */
	constructor(http: HttpClient) {
		super(http);
	}

	public async getProfiles(idOrName: number | string): Promise<ResponseProfile>;
	public async getProfiles(): Promise<Array<ResponseProfile>>;
	/**
	 * Retrieves Profiles from the API.
	 *
	 * @param idOrName Specify either the integral, unique identifier (number) of a specific Profile to retrieve, or its name (string).
	 * @returns The requested Profile(s).
	 */
	public async getProfiles(idOrName?: number | string): Promise<Array<ResponseProfile> | ResponseProfile> {
		const path = "profiles";
		let prom;
		if (idOrName !== undefined) {
			let params;
			switch (typeof idOrName) {
				case "number":
					params = {id: String(idOrName)};
					break;
				case "string":
					params = {name: idOrName};
			}
			prom = this.get<[ResponseProfile]>(path, undefined, params).toPromise().then(r=>r[0]).then(profileMap);
		} else {
			prom = this.get<Array<ResponseProfile>>(path).toPromise().then(r=>r.map(profileMap));
		}
		return prom;
	}
}
