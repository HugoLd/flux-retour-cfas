import React, { useState } from "react";

import { ERPS } from "../../../../common/constants/erps";
import { _post } from "../../../../common/httpClient";

export const SUBMIT_STATE = {
  waiting: "waiting",
  success: "success",
  fail: "fail",
};

const withSubmitBranchementErpDemand = (Component) => {
  const WithSubmitBranchementErpDemand = ({ ...props }) => {
    const [submitState, setSubmitState] = useState(SUBMIT_STATE.waiting);
    const [erpState, setErpState] = useState(ERPS[0].state);

    const sendBranchementErpDemand = async (formData) => {
      try {
        await _post("/api/demande-branchement-erp", {
          erp: ERPS[formData.erpIndex].name,
          nom_organisme: formData.nom_organisme,
          uai_organisme: formData.uai_organisme,
          email_demandeur: formData.email_demandeur,
          nb_apprentis: formData.nb_apprentis,
        });
        setErpState(ERPS[formData.erpIndex].state);
        setSubmitState(SUBMIT_STATE.success);
      } catch (err) {
        setSubmitState(SUBMIT_STATE.fail);
      }
    };

    return (
      <Component
        sendBranchementErpDemand={sendBranchementErpDemand}
        submitState={submitState}
        erpState={erpState}
        {...props}
      />
    );
  };

  return WithSubmitBranchementErpDemand;
};

export default withSubmitBranchementErpDemand;
