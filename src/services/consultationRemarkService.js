import api from "../utils/api";
import { extractData } from "./appointmentService";
import get from "lodash/get";

export const consultationRemarksService = {
    addConsultationReport: async (data) => {
        const patientId = get(data, 'patient.id', null);
        const doctorId = get(data, 'doctor.id', null);

        const payload = {
            remarks: get(data, 'remarks', ''),
            keypoints: get(data, 'keypoints', ''),
            diagnosis: get(data, 'diagnosis', ''),
            prescriptions: get(data, 'prescriptions', [])
        }
        const response = await api.post(`/medical-record/create/${patientId}/${doctorId}`, payload)
        const responseData = extractData(response)
        return responseData;
    }
}