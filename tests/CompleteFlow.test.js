const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

test.describe.serial('Complete Provider and Patient Creation Test', () => {
    let testContext = {
        accessToken: '',
        refreshToken: '',
        providerUUID: '',
        providerData: {},
        availabilityData: {},
        createdProviderEmail: '',
        patientUUID: '',
        patientData: {},
        createdPatientEmail: '',
        appointmentUUID: '',
        appointmentData: {}
    };

    test.beforeAll(async ({ request }) => {
        console.log('🔐 Setting up authentication...');
        
        // Validate faker is available
        if (!faker) {
            throw new Error('Faker library not found. Please install it with: npm install @faker-js/faker --save-dev');
        }

        // Login to get access token
        const loginUrl = 'https://stage-api.ecarehealth.com/api/master/login';
        const loginData = {
            username: "RubyVOlague@jourrapide.com",
            password: "Pass@123",
            xTENANTID: "stage_aithinkitive"
        };

        const loginHeaders = {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
            'Origin': 'https://stage_aithinkitive.uat.provider.ecarehealth.com',
            'Referer': 'https://stage_aithinkitive.uat.provider.ecarehealth.com/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
            'X-TENANT-ID': 'stage_aithinkitive',
            'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"'
        };

        const loginResponse = await request.post(loginUrl, {
            data: loginData,
            headers: loginHeaders,
            timeout: 30000
        });

        console.log(`📊 Login Status: ${loginResponse.status()}`);

        expect(loginResponse.status()).toBe(200);
        
        const loginResponseData = await loginResponse.json();
        
        if (loginResponseData.data && loginResponseData.data.access_token) {
            testContext.accessToken = loginResponseData.data.access_token;
            testContext.refreshToken = loginResponseData.data.refresh_token || '';
            console.log('✅ Authentication successful');
            console.log(`🔑 Token: ${testContext.accessToken.substring(0, 30)}...`);
        } else {
            throw new Error('Access token not found in login response');
        }

        console.log('✅ Setup completed');
    });

    test('2. should create provider with status 201', async ({ request }) => {
        console.log('👨‍⚕️ Creating provider...');
        
        // Generate provider data
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });

        // Store the email for later UUID retrieval
        testContext.createdProviderEmail = email;

        testContext.providerData = {
            roleType: "PROVIDER",
            active: false,
            admin_access: true,
            status: false,
            avatar: "",
            role: "PROVIDER",
            firstName: firstName,
            lastName: lastName,
            gender: "MALE",
            phone: "",
            npi: "",
            specialities: null,
            groupNpiNumber: "",
            licensedStates: null,
            licenseNumber: "",
            acceptedInsurances: null,
            experience: "",
            taxonomyNumber: "",
            workLocations: null,
            email: email,
            officeFaxNumber: "",
            areaFocus: "",
            hospitalAffiliation: "",
            ageGroupSeen: null,
            spokenLanguages: null,
            providerEmployment: "",
            insurance_verification: "",
            prior_authorization: "",
            secondOpinion: "",
            careService: null,
            bio: "",
            expertise: "",
            workExperience: "",
            licenceInformation: [
                {
                    uuid: "",
                    licenseState: "",
                    licenseNumber: ""
                }
            ],
            deaInformation: [
                {
                    deaState: "",
                    deaNumber: "",
                    deaTermDate: "",
                    deaActiveDate: ""
                }
            ]
        };

        const providerUrl = 'https://stage-api.ecarehealth.com/api/master/provider';
        
        const providerHeaders = {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Authorization': `Bearer ${testContext.accessToken}`,
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
            'Origin': 'https://stage_aithinkitive.uat.provider.ecarehealth.com',
            'Referer': 'https://stage_aithinkitive.uat.provider.ecarehealth.com/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
            'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"'
        };

        console.log('📡 Making provider creation request...');
        console.log(`📋 Creating: ${firstName} ${lastName} (${email})`);

        const providerResponse = await request.post(providerUrl, {
            data: testContext.providerData,
            headers: providerHeaders,
            timeout: 30000
        });

        const responseStatus = providerResponse.status();
        const responseText = await providerResponse.text();
        
        console.log(`📊 Provider Response Status: ${responseStatus}`);
        console.log(`📄 Provider Response Body: ${responseText}`);

        // Validate status code is 201
        expect(responseStatus).toBe(201);
        console.log('✅ Provider created successfully with status 201');
    });

    test('3. should get provider UUID from GET providers endpoint', async ({ request }) => {
        console.log('🔍 Retrieving provider UUID from GET providers endpoint...');
        
        const getProvidersUrl = 'https://stage-api.ecarehealth.com/api/master/provider?page=0&size=8';
        
        const getHeaders = {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Authorization': `Bearer ${testContext.accessToken}`,
            'Connection': 'keep-alive',
            'Origin': 'https://stage_aithinkitive.uat.provider.ecarehealth.com',
            'Referer': 'https://stage_aithinkitive.uat.provider.ecarehealth.com/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
            'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"'
        };

        console.log(`🔍 Looking for provider with email: ${testContext.createdProviderEmail}`);

        const getResponse = await request.get(getProvidersUrl, {
            headers: getHeaders,
            timeout: 30000
        });

        const getStatus = getResponse.status();
        const getResponseText = await getResponse.text();
        
        console.log(`📊 GET Providers Response Status: ${getStatus}`);
        expect(getStatus).toBe(200);

        const providersData = JSON.parse(getResponseText);
        
        // Function to search for provider by email
        function findProviderByEmail(obj, targetEmail) {
            if (Array.isArray(obj)) {
                for (const item of obj) {
                    const result = findProviderByEmail(item, targetEmail);
                    if (result) return result;
                }
            } else if (typeof obj === 'object' && obj !== null) {
                if (obj.email === targetEmail) {
                    const possibleUUIDFields = ['uuid', 'id', 'providerId', 'provider_id', 'userId', 'user_id', 'providerUuid'];
                    for (const field of possibleUUIDFields) {
                        if (obj[field]) {
                            return { uuid: obj[field], provider: obj, field: field };
                        }
                    }
                    return { provider: obj };
                }
                for (const value of Object.values(obj)) {
                    const result = findProviderByEmail(value, targetEmail);
                    if (result) return result;
                }
            }
            return null;
        }

        const foundProvider = findProviderByEmail(providersData, testContext.createdProviderEmail);
        
        if (foundProvider && foundProvider.uuid) {
            testContext.providerUUID = foundProvider.uuid;
            console.log(`✅ Provider UUID retrieved: ${testContext.providerUUID}`);
            expect(testContext.providerUUID).toBeTruthy();
        } else {
            throw new Error(`Provider with email ${testContext.createdProviderEmail} not found`);
        }
    });

    test('4. should set provider availability', async ({ request }) => {
        console.log('📅 Setting provider availability...');
        
        expect(testContext.providerUUID).toBeTruthy();
        
        const availabilityUrl = 'https://stage-api.ecarehealth.com/api/master/provider/availability-setting';
        
        const availabilityData = {
            "settings": [
                {
                    "type": "NEW",
                    "slotTime": 30,
                    "minNoticeUnit": "string"
                }
            ],
            "providerId": testContext.providerUUID,
            "bookingWindow": "3",
            "timezone": "IST",
            "initialConsultTime": 30,
            "followupConsultTime": 0,
            "administrativeConsultTime": 0,
            "careCoordinationConsultTime": 0,
            "medicationBriefConsultTime": 0,
            "nursingOnlyConsultTime": 0,
            "telephoneCallConsultTime": 0,
            "urgentVisitConsultTime": 0,
            "videoVisitConsultTime": 0,
            "wellnessExamConsultTime": 0,
            "bufferTime": 0,
            "bookBefore": "undefined undefined",
            "blockDays": [],
            "daySlots": [
                {
                    "day": "MONDAY",
                    "startTime": "08:00:00",
                    "endTime": "20:00:00",
                    "location": null,
                    "availabilityMode": "VIRTUAL"
                },
                {
                    "day": "TUESDAY",
                    "startTime": "08:00:00",
                    "endTime": "20:00:00",
                    "location": null,
                    "availabilityMode": "VIRTUAL"
                },
                {
                    "day": "WEDNESDAY",
                    "startTime": "08:00:00",
                    "endTime": "20:00:00",
                    "location": null,
                    "availabilityMode": "VIRTUAL"
                },
                {
                    "day": "THURSDAY",
                    "startTime": "12:00:00",
                    "endTime": "13:00:00",
                    "location": null,
                    "availabilityMode": "VIRTUAL"
                },
                {
                    "day": "FRIDAY",
                    "startTime": "12:00:00",
                    "endTime": "13:00:00",
                    "location": null,
                    "availabilityMode": "VIRTUAL"
                }
            ],
            "startTime": null,
            "endTime": null,
            "setToWeekdays": true,
            "minNoticeTime": "undefined",
            "minNoticeUnit": "undefined",
            "xTENANTID": "stage_aithinkitive"
        };

        const availabilityHeaders = {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Authorization': `Bearer ${testContext.accessToken}`,
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
            'Origin': 'https://stage_aithinkitive.uat.provider.ecarehealth.com',
            'Referer': 'https://stage_aithinkitive.uat.provider.ecarehealth.com/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
            'X-TENANT-ID': 'stage_aithinkitive',
            'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"'
        };

        console.log(`👨‍⚕️ Setting availability for provider: ${testContext.providerUUID}`);

        const availabilityResponse = await request.post(availabilityUrl, {
            data: availabilityData,
            headers: availabilityHeaders,
            timeout: 30000
        });

        const availabilityStatus = availabilityResponse.status();
        const availabilityResponseText = await availabilityResponse.text();
        
        console.log(`📊 Availability Response Status: ${availabilityStatus}`);
        console.log(`📄 Availability Response: ${availabilityResponseText}`);

        if (availabilityStatus === 200 || availabilityStatus === 201) {
            console.log('✅ Provider availability set successfully');
            testContext.availabilityData = { status: 'success' };
            expect([200, 201]).toContain(availabilityStatus);
        } else {
            throw new Error(`Availability setting failed with status ${availabilityStatus}: ${availabilityResponseText}`);
        }
    });

    test('5. should add patient with status 201', async ({ request }) => {
        console.log('👤 Creating patient...');
        
        // Generate patient data using faker
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });
        const phoneNumber = faker.phone.number();
        const birthDate = faker.date.birthdate({ min: 18, max: 80, mode: 'age' });
        
        // Store the email for later UUID retrieval
        testContext.createdPatientEmail = email;

        // Format birth date to match the expected format
        const formattedBirthDate = birthDate.toISOString();

        testContext.patientData = {
            "phoneNotAvailable": false,
            "emailNotAvailable": false,
            "registrationDate": "",
            "firstName": firstName,
            "middleName": "",
            "lastName": lastName,
            "timezone": "IST",
            "birthDate": formattedBirthDate,
            "gender": faker.person.sex().toUpperCase(), // "MALE" or "FEMALE"
            "ssn": "",
            "mrn": "",
            "languages": null,
            "avatar": "",
            "mobileNumber": phoneNumber,
            "faxNumber": "",
            "homePhone": "",
            "email": email,
            "address": {
                "line1": "",
                "line2": "",
                "city": "",
                "state": "",
                "country": "",
                "zipcode": ""
            },
            "emergencyContacts": [
                {
                    "firstName": "",
                    "lastName": "",
                    "mobile": ""
                }
            ],
            "patientInsurances": [
                {
                    "active": true,
                    "insuranceId": "",
                    "copayType": "FIXED",
                    "coInsurance": "",
                    "claimNumber": "",
                    "note": "",
                    "deductibleAmount": "",
                    "employerName": "",
                    "employerAddress": {
                        "line1": "",
                        "line2": "",
                        "city": "",
                        "state": "",
                        "country": "",
                        "zipcode": ""
                    },
                    "subscriberFirstName": "",
                    "subscriberLastName": "",
                    "subscriberMiddleName": "",
                    "subscriberSsn": "",
                    "subscriberMobileNumber": "",
                    "subscriberAddress": {
                        "line1": "",
                        "line2": "",
                        "city": "",
                        "state": "",
                        "country": "",
                        "zipcode": ""
                    },
                    "groupId": "",
                    "memberId": "",
                    "groupName": "",
                    "frontPhoto": "",
                    "backPhoto": "",
                    "insuredFirstName": "",
                    "insuredLastName": "",
                    "address": {
                        "line1": "",
                        "line2": "",
                        "city": "",
                        "state": "",
                        "country": "",
                        "zipcode": ""
                    },
                    "insuredBirthDate": "",
                    "coPay": "",
                    "insurancePayer": {}
                }
            ],
            "emailConsent": false,
            "messageConsent": false,
            "callConsent": false,
            "patientConsentEntities": [
                {
                    "signedDate": new Date().toISOString()
                }
            ]
        };

        const patientUrl = 'https://stage-api.ecarehealth.com/api/master/patient';
        
        const patientHeaders = {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Authorization': `Bearer ${testContext.accessToken}`,
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
            'Origin': 'https://stage_aithinkitive.uat.provider.ecarehealth.com',
            'Referer': 'https://stage_aithinkitive.uat.provider.ecarehealth.com/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
            'X-TENANT-ID': 'stage_aithinkitive',
            'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"'
        };

        console.log('📡 Making patient creation request...');
        console.log(`📋 Creating patient: ${firstName} ${lastName}`);
        console.log(`📧 Email: ${email}`);
        console.log(`📱 Phone: ${phoneNumber}`);
        console.log(`🎂 Birth Date: ${formattedBirthDate}`);

        const patientResponse = await request.post(patientUrl, {
            data: testContext.patientData,
            headers: patientHeaders,
            timeout: 30000
        });

        const responseStatus = patientResponse.status();
        const responseText = await patientResponse.text();
        
        console.log(`📊 Patient Response Status: ${responseStatus}`);
        console.log(`📄 Patient Response Body: ${responseText}`);

        // Validate status code is 201 (Created)
        if (responseStatus === 201) {
            console.log('✅ SUCCESS: Patient created with status 201');
            
            // Try to extract patient UUID from creation response
            try {
                const responseData = JSON.parse(responseText);
                console.log('📋 Patient Creation Response Structure:', JSON.stringify(responseData, null, 2));
                
                // Look for patient ID/UUID in various locations
                const possibleIds = [
                    responseData.uuid,
                    responseData.id,
                    responseData.patientId,
                    responseData.data?.uuid,
                    responseData.data?.id,
                    responseData.data?.patientId,
                    responseData.result?.uuid,
                    responseData.result?.id,
                    responseData.result?.patientId,
                    responseData.patient?.uuid,
                    responseData.patient?.id,
                    responseData.patient?.patientId
                ];
                
                const patientId = possibleIds.find(id => id && typeof id === 'string');
                
                if (patientId) {
                    testContext.patientUUID = patientId;
                    console.log(`✅ Patient UUID extracted from creation response: ${patientId}`);
                } else {
                    console.log('ℹ️ Patient UUID not found in creation response - will retrieve via GET endpoint');
                }

            } catch (parseError) {
                console.log('⚠️ Patient creation response not JSON - will retrieve UUID via GET endpoint');
            }

            expect(responseStatus).toBe(201);
            console.log('🎉 Patient creation test PASSED!');

        } else if (responseStatus === 400) {
            console.log('❌ Bad Request (400) - Check patient data format');
            
            try {
                const errorData = JSON.parse(responseText);
                console.log('📋 Error Details:', JSON.stringify(errorData, null, 2));
            } catch (e) {
                console.log('📋 Error Response:', responseText);
            }
            
            throw new Error(`Expected status 201, got ${responseStatus}: ${responseText}`);

        } else if (responseStatus === 401) {
            console.log('❌ Unauthorized (401) - Check access token');
            throw new Error(`Token authentication failed: ${responseText}`);

        } else {
            console.log(`❌ Unexpected status: ${responseStatus}`);
            throw new Error(`Expected status 201, got ${responseStatus}: ${responseText}`);
        }
    });

    test('6. should get patient UUID from GET patients endpoint', async ({ request }) => {
        console.log('🔍 Retrieving patient UUID from GET patients endpoint...');
        
        // If we already have UUID from creation response, we can still validate with GET
        if (testContext.patientUUID) {
            console.log(`ℹ️ Patient UUID already available from creation: ${testContext.patientUUID}`);
            console.log('🔍 Will still call GET endpoint to validate and demonstrate the process');
        }

        // Use the exact curl format for GET patients with search functionality
        const getPatientsUrl = 'https://stage-api.ecarehealth.com/api/master/patient?page=0&size=10&searchString=';
        
        const getHeaders = {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Authorization': `Bearer ${testContext.accessToken}`,
            'Connection': 'keep-alive',
            'Origin': 'https://stage_aithinkitive.uat.provider.ecarehealth.com',
            'Referer': 'https://stage_aithinkitive.uat.provider.ecarehealth.com/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
            'X-TENANT-ID': 'stage_aithinkitive',
            'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"'
        };

        console.log(`🔍 Looking for patient with email: ${testContext.createdPatientEmail}`);
        console.log('📡 Making GET patients request with search functionality...');

        const getResponse = await request.get(getPatientsUrl, {
            headers: getHeaders,
            timeout: 30000
        });

        const getStatus = getResponse.status();
        const getResponseText = await getResponse.text();
        
        console.log(`📊 GET Patients Response Status: ${getStatus}`);

        // Validate GET request was successful
        expect(getStatus).toBe(200);
        console.log('✅ GET patients request successful');

        try {
            const patientsData = JSON.parse(getResponseText);
            console.log('📋 GET Patients Response Structure:');
            //console.log(JSON.stringify(patientsData, null, 2));
            
            // Function to search for patient by email recursively
            function findPatientByEmail(obj, targetEmail) {
                if (Array.isArray(obj)) {
                    for (const item of obj) {
                        const result = findPatientByEmail(item, targetEmail);
                        if (result) return result;
                    }
                } else if (typeof obj === 'object' && obj !== null) {
                    // Check if current object has email matching our patient
                    if (obj.email === targetEmail) {
                        console.log(`✅ Found patient with matching email: ${targetEmail}`);
                        
                        // Look for UUID in various possible fields
                        const possibleUUIDFields = ['uuid', 'id', 'patientId', 'patient_id', 'userId', 'user_id', 'patientUuid'];
                        for (const field of possibleUUIDFields) {
                            if (obj[field]) {
                                console.log(`🆔 Found UUID in field '${field}': ${obj[field]}`);
                                return { uuid: obj[field], patient: obj, field: field };
                            }
                        }
                        
                        // If no standard UUID field, log the object structure
                        console.log('📋 Patient object structure:', JSON.stringify(obj, null, 2));
                        console.log('📋 Available fields:', Object.keys(obj));
                        
                        // Try to find any field that looks like a UUID
                        const allFields = Object.keys(obj);
                        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                        
                        for (const field of allFields) {
                            if (typeof obj[field] === 'string' && uuidPattern.test(obj[field])) {
                                console.log(`🆔 Found UUID-like value in field '${field}': ${obj[field]}`);
                                return { uuid: obj[field], patient: obj, field: field };
                            }
                        }
                        
                        return { patient: obj };
                    }
                    
                    // Recursively search in nested objects
                    for (const value of Object.values(obj)) {
                        const result = findPatientByEmail(value, targetEmail);
                        if (result) return result;
                    }
                }
                return null;
            }

            const foundPatient = findPatientByEmail(patientsData, testContext.createdPatientEmail);
            
            if (foundPatient && foundPatient.uuid) {
                const retrievedUUID = foundPatient.uuid;
                console.log(`✅ Successfully retrieved patient UUID from GET endpoint: ${retrievedUUID}`);
                console.log(`📋 UUID found in field: ${foundPatient.field}`);
                
                // If we didn't have UUID from creation, store it now
                if (!testContext.patientUUID) {
                    testContext.patientUUID = retrievedUUID;
                    console.log('✅ Stored UUID from GET endpoint for future use');
                } else {
                    // Compare UUIDs if we have both
                    if (testContext.patientUUID === retrievedUUID) {
                        console.log('✅ UUID from creation matches UUID from GET endpoint');
                    } else {
                        console.log('⚠️ UUID mismatch detected:');
                        console.log(`   Creation response UUID: ${testContext.patientUUID}`);
                        console.log(`   GET endpoint UUID: ${retrievedUUID}`);
                        console.log('ℹ️ Using GET endpoint UUID as it\'s more reliable');
                        testContext.patientUUID = retrievedUUID;
                    }
                }
                
                // Additional validation
                expect(testContext.patientUUID).toBeTruthy();
                expect(typeof testContext.patientUUID).toBe('string');
                expect(testContext.patientUUID.length).toBeGreaterThan(0);
                
                // Check if it looks like a UUID
                const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                if (uuidPattern.test(testContext.patientUUID)) {
                    console.log('✅ UUID format validation passed');
                } else {
                    console.log('⚠️ UUID format may be non-standard, but proceeding...');
                }
                
            } else if (foundPatient) {
                console.log('⚠️ Found patient but no UUID field identified');
                console.log('📋 Available fields in patient object:', Object.keys(foundPatient.patient));
                
                // Try to extract any ID-like field
                const patient = foundPatient.patient;
                const allFields = Object.keys(patient);
                const idLikeFields = allFields.filter(field => 
                    field.toLowerCase().includes('id') || 
                    field.toLowerCase().includes('uuid')
                );
                
                if (idLikeFields.length > 0) {
                    console.log('🔍 ID-like fields found:', idLikeFields);
                    testContext.patientUUID = patient[idLikeFields[0]];
                    console.log(`🆔 Using field '${idLikeFields[0]}': ${testContext.patientUUID}`);
                } else {
                    throw new Error('No UUID or ID field found in patient object');
                }
                
            } else {
                console.log('❌ Patient not found in GET response');
                console.log('🔍 This could mean:');
                console.log('   1. Patient creation was not fully completed');
                console.log('   2. There is a delay in patient availability');
                console.log('   3. Patient is created but not in the first 10 results');
                
                // Try to list all patients in response for debugging
                console.log('📋 All patients in response:');
                if (patientsData.content && Array.isArray(patientsData.content)) {
                    patientsData.content.forEach((patient, index) => {
                        console.log(`   ${index + 1}. ${patient.firstName || 'N/A'} ${patient.lastName || 'N/A'} (${patient.email || 'N/A'})`);
                    });
                } else if (patientsData.data && Array.isArray(patientsData.data)) {
                    patientsData.data.forEach((patient, index) => {
                        console.log(`   ${index + 1}. ${patient.firstName || 'N/A'} ${patient.lastName || 'N/A'} (${patient.email || 'N/A'})`);
                    });
                } else if (Array.isArray(patientsData)) {
                    patientsData.forEach((patient, index) => {
                        console.log(`   ${index + 1}. ${patient.firstName || 'N/A'} ${patient.lastName || 'N/A'} (${patient.email || 'N/A'})`);
                    });
                } else {
                    console.log('📋 Unexpected response structure - cannot list patients');
                }
                
                // If we have UUID from creation, that's acceptable
                if (testContext.patientUUID) {
                    console.log('ℹ️ Using patient UUID from creation response instead');
                } else {
                    throw new Error(`Patient with email ${testContext.createdPatientEmail} not found in GET response`);
                }
            }

        } catch (parseError) {
            console.log('❌ Failed to parse GET patients response');
            console.log('📋 Parse error:', parseError.message);
            console.log('📄 Raw response excerpt:', getResponseText.substring(0, 500));
            
            // If we have UUID from creation, that's acceptable
            if (testContext.patientUUID) {
                console.log('ℹ️ Using patient UUID from creation response instead');
            } else {
                throw new Error('Failed to parse patients response and no UUID from creation');
            }
        }
    });

    test('7. should book appointment between created patient and provider', async ({ request }) => {
        console.log('📅 Booking appointment between created patient and provider...');
        
        // Ensure we have all required data
        expect(testContext.accessToken).toBeTruthy();
        expect(testContext.providerUUID).toBeTruthy();
        expect(testContext.patientUUID).toBeTruthy();
        
        console.log(`🔑 Using access token: ${testContext.accessToken.substring(0, 30)}...`);
        console.log(`👨‍⚕️ Provider UUID: ${testContext.providerUUID}`);
        console.log(`👤 Patient UUID: ${testContext.patientUUID}`);

        // Generate appointment time within the provider's availability
        // Based on availability: Monday-Wednesday (8:00-20:00), Thursday-Friday (12:00-13:00)
        const now = new Date();
        const appointmentDate = new Date(now);
        
        // Set appointment for next Monday at 10:00 AM (within availability window)
        const daysUntilMonday = (1 + 7 - appointmentDate.getDay()) % 7 || 7;
        appointmentDate.setDate(appointmentDate.getDate() + daysUntilMonday);
        appointmentDate.setHours(10, 0, 0, 0);
        
        const startTime = appointmentDate.toISOString();
        const endTime = new Date(appointmentDate.getTime() + 30 * 60000).toISOString(); // 30 minutes later

        const appointmentUrl = 'https://stage-api.ecarehealth.com/api/master/appointment';
        
        // Create appointment data using the exact curl format
        testContext.appointmentData = {
            "mode": "VIRTUAL",
            "patientId": testContext.patientUUID,
            "customForms": null,
            "visit_type": "",
            "type": "NEW",
            "paymentType": "CASH",
            "providerId": testContext.providerUUID,
            "startTime": startTime,
            "endTime": endTime,
            "insurance_type": "",
            "note": "",
            "authorization": "",
            "forms": [],
            "chiefComplaint": faker.lorem.sentence(),
            "isRecurring": false,
            "recurringFrequency": "daily",
            "reminder_set": false,
            "endType": "never",
            "endDate": new Date().toISOString(),
            "endAfter": 5,
            "customFrequency": 1,
            "customFrequencyUnit": "days",
            "selectedWeekdays": [],
            "reminder_before_number": 1,
            "timezone": "IST",
            "duration": 30,
            "xTENANTID": "stage_aithinkitive"
        };

        const appointmentHeaders = {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Authorization': `Bearer ${testContext.accessToken}`,
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
            'Origin': 'https://stage_aithinkitive.uat.provider.ecarehealth.com',
            'Referer': 'https://stage_aithinkitive.uat.provider.ecarehealth.com/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
            'X-TENANT-ID': 'stage_aithinkitive',
            'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"'
        };

        console.log('📡 Making appointment booking request...');
        console.log(`📅 Appointment scheduled for: ${startTime}`);
        console.log(`⏰ Duration: 30 minutes (${startTime} - ${endTime})`);
        console.log(`💻 Mode: Virtual appointment`);
        console.log(`🏥 Chief Complaint: ${testContext.appointmentData.chiefComplaint}`);
       // console.log('📋 Appointment Data:', JSON.stringify(testContext.appointmentData, null, 2));

        const appointmentResponse = await request.post(appointmentUrl, {
            data: testContext.appointmentData,
            headers: appointmentHeaders,
            timeout: 30000
        });

        const responseStatus = appointmentResponse.status();
        const responseText = await appointmentResponse.text();
        
        console.log(`📊 Appointment Response Status: ${responseStatus}`);
        console.log(`📄 Appointment Response Body: ${responseText}`);

        // Validate appointment booking response
        if (responseStatus === 201) {
            console.log('✅ SUCCESS: Appointment booked successfully with status 201');
            
            // Try to extract appointment UUID from creation response
            try {
                const responseData = JSON.parse(responseText);
                console.log('📋 Appointment Creation Response Structure:', JSON.stringify(responseData, null, 2));
                
                // Look for appointment ID/UUID in various locations
                const possibleIds = [
                    responseData.uuid,
                    responseData.id,
                    responseData.appointmentId,
                    responseData.appointment_id,
                    responseData.data?.uuid,
                    responseData.data?.id,
                    responseData.data?.appointmentId,
                    responseData.result?.uuid,
                    responseData.result?.id,
                    responseData.result?.appointmentId,
                    responseData.appointment?.uuid,
                    responseData.appointment?.id,
                    responseData.appointment?.appointmentId
                ];
                
                const appointmentId = possibleIds.find(id => id && typeof id === 'string');
                
                if (appointmentId) {
                    testContext.appointmentUUID = appointmentId;
                    console.log(`✅ Appointment UUID extracted: ${appointmentId}`);
                } else {
                    console.log('ℹ️ Appointment UUID not found in creation response');
                    console.log('📋 Available response fields:', Object.keys(responseData));
                    
                    // Search for any UUID-like pattern in the response
                    const responseString = JSON.stringify(responseData);
                    const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
                    const foundUUIDs = responseString.match(uuidPattern);
                    
                    if (foundUUIDs && foundUUIDs.length > 0) {
                        testContext.appointmentUUID = foundUUIDs[0];
                        console.log(`✅ Found UUID pattern in response: ${testContext.appointmentUUID}`);
                    } else {
                        console.log('ℹ️ No UUID found in appointment response');
                    }
                }

                // Validate response structure
                if (responseData.code) {
                    console.log(`✅ Response Code: ${responseData.code}`);
                }
                if (responseData.message) {
                    console.log(`✅ Response Message: ${responseData.message}`);
                }

            } catch (parseError) {
                console.log('⚠️ Appointment response not JSON, but booking successful (status 201)');
                console.log('📋 Parse Error:', parseError.message);
            }

            expect(responseStatus).toBe(201);
            console.log('🎉 Appointment booking test PASSED!');

        } else if (responseStatus === 400) {
            console.log('❌ Bad Request (400) - Check appointment data format');
            
            try {
                const errorData = JSON.parse(responseText);
                console.log('📋 Error Details:', JSON.stringify(errorData, null, 2));
                
                // Provide specific guidance for appointment booking errors
                if (errorData.message) {
                    if (errorData.message.includes('availability')) {
                        console.log('🔍 Availability Issue:');
                        console.log('   - Check if appointment time is within provider availability');
                        console.log('   - Ensure time slot is not already booked');
                        console.log('   - Verify appointment is in the future');
                    } else if (errorData.message.includes('patient')) {
                        console.log('🔍 Patient Issue:');
                        console.log(`   - Patient UUID: ${testContext.patientUUID}`);
                        console.log('   - Check if patient exists and is active');
                    } else if (errorData.message.includes('provider')) {
                        console.log('🔍 Provider Issue:');
                        console.log(`   - Provider UUID: ${testContext.providerUUID}`);
                        console.log('   - Check if provider exists and has availability set');
                    }
                }
                
            } catch (e) {
                console.log('📋 Raw Error Response:', responseText);
            }
            
            throw new Error(`Expected status 201, got ${responseStatus}: ${responseText}`);

        } else if (responseStatus === 401) {
            console.log('❌ Unauthorized (401) - Check access token');
            throw new Error(`Token authentication failed: ${responseText}`);

        } else if (responseStatus === 409) {
            console.log('❌ Conflict (409) - Appointment slot may already be booked');
            console.log('🔍 Try booking a different time slot');
            throw new Error(`Appointment conflict: ${responseText}`);

        } else {
            console.log(`❌ Unexpected status: ${responseStatus}`);
            throw new Error(`Expected status 201, got ${responseStatus}: ${responseText}`);
        }
    });

    //test('8. should validate complete workflow', async () => {
    test('8. should validate complete workflow', async () => {
        console.log('🔍 Final validation of complete healthcare workflow...');
        
        // Validate provider
        expect(testContext.providerData.firstName).toBeTruthy();
        expect(testContext.providerUUID).toBeTruthy();
        console.log('✅ Provider creation and setup validated');

        // Validate patient
        expect(testContext.patientData.firstName).toBeTruthy();
        expect(testContext.patientUUID).toBeTruthy();
        console.log('✅ Patient creation and setup validated');

        // Validate availability
        expect(testContext.availabilityData).toBeDefined();
        console.log('✅ Provider availability configuration validated');

        // Validate appointment
        expect(testContext.appointmentData).toBeDefined();
        expect(Object.keys(testContext.appointmentData).length).toBeGreaterThan(0);
        console.log('✅ Appointment booking validated');

        if (testContext.appointmentUUID) {
            expect(testContext.appointmentUUID).toBeTruthy();
            expect(typeof testContext.appointmentUUID).toBe('string');
            console.log(`✅ Appointment UUID validated: ${testContext.appointmentUUID}`);
        } else {
            console.log('ℹ️ Appointment UUID not available (may be normal depending on API response)');
        }
        
        console.log('✅ Complete healthcare workflow validation passed');
    });
    //});

    test.afterAll(async () => {
        console.log('🏁 === Complete Healthcare Workflow Results ===');
        console.log(`🔑 Access Token: ${testContext.accessToken ? '✅ Available' : '❌ Missing'}`);
        
        // Provider Summary
        console.log('\n👨‍⚕️ PROVIDER SUMMARY:');
        console.log(`   Created: ${testContext.providerData.firstName ? '✅ Yes' : '❌ No'}`);
        console.log(`   UUID Retrieved: ${testContext.providerUUID ? '✅ Yes' : '❌ No'}`);
        console.log(`   Availability Set: ${testContext.availabilityData ? '✅ Yes' : '❌ No'}`);
        
        if (testContext.providerData.firstName) {
            console.log(`   Name: ${testContext.providerData.firstName} ${testContext.providerData.lastName}`);
            console.log(`   Email: ${testContext.createdProviderEmail}`);
            console.log(`   UUID: ${testContext.providerUUID || 'Not retrieved'}`);
        }
        
        // Patient Summary
        console.log('\n👤 PATIENT SUMMARY:');
        console.log(`   Created: ${testContext.patientData.firstName ? '✅ Yes' : '❌ No'}`);
        console.log(`   UUID Retrieved: ${testContext.patientUUID ? '✅ Yes' : '❌ No'}`);
        
        if (testContext.patientData.firstName) {
            console.log(`   Name: ${testContext.patientData.firstName} ${testContext.patientData.lastName}`);
            console.log(`   Email: ${testContext.createdPatientEmail}`);
            console.log(`   UUID: ${testContext.patientUUID || 'Not retrieved'}`);
            console.log(`   Gender: ${testContext.patientData.gender}`);
            console.log(`   Phone: ${testContext.patientData.mobileNumber}`);
        }
        
        // Availability Summary
        if (testContext.availabilityData) {
            console.log('\n📅 AVAILABILITY SUMMARY:');
            console.log('   Schedule: Monday-Wednesday (8:00-20:00), Thursday-Friday (12:00-13:00)');
            console.log('   Mode: Virtual appointments');
            console.log('   Slot Duration: 30 minutes');
            console.log('   Timezone: IST');
        }

        // Appointment Summary
        console.log('\n📅 APPOINTMENT SUMMARY:');
        console.log(`   Booked: ${testContext.appointmentData.startTime ? '✅ Yes' : '❌ No'}`);
        console.log(`   UUID Retrieved: ${testContext.appointmentUUID ? '✅ Yes' : 'ℹ️ Not available'}`);
        
        if (testContext.appointmentData.startTime) {
            console.log(`   Start Time: ${testContext.appointmentData.startTime}`);
            console.log(`   End Time: ${testContext.appointmentData.endTime}`);
            console.log(`   Duration: ${testContext.appointmentData.duration} minutes`);
            console.log(`   Mode: ${testContext.appointmentData.mode}`);
            console.log(`   Type: ${testContext.appointmentData.type}`);
            console.log(`   Payment: ${testContext.appointmentData.paymentType}`);
            console.log(`   Chief Complaint: ${testContext.appointmentData.chiefComplaint}`);
            
            if (testContext.appointmentUUID) {
                console.log(`   UUID: ${testContext.appointmentUUID}`);
            }
        }
        
        // Final Summary
        console.log('\n🎯 COMPLETE WORKFLOW STATUS:');
        const workflowSteps = [
            { name: 'Provider Creation', status: testContext.providerUUID ? '✅' : '❌' },
            { name: 'Provider Availability', status: testContext.availabilityData ? '✅' : '❌' },
            { name: 'Patient Creation', status: testContext.patientUUID ? '✅' : '❌' },
            { name: 'Appointment Booking', status: testContext.appointmentData.startTime ? '✅' : '❌' }
        ];
        
        workflowSteps.forEach(step => {
            console.log(`   ${step.status} ${step.name}`);
        });
        
        const allStepsCompleted = workflowSteps.every(step => step.status === '✅');
        console.log(`\n🏆 Overall Success: ${allStepsCompleted ? '✅ COMPLETE HEALTHCARE WORKFLOW SUCCESSFUL!' : '❌ Some steps failed'}`);
        
        if (allStepsCompleted) {
            console.log('\n🎉 Congratulations! You have successfully:');
            console.log('   1. Created a healthcare provider with availability settings');
            console.log('   2. Created a patient with complete profile');
            console.log('   3. Booked an appointment between patient and provider');
            console.log('   4. All UUIDs have been captured for future operations');
        }
        
        console.log('\n🎯 Complete healthcare workflow automation finished!');
    });
});