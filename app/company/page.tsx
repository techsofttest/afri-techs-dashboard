'use client';

import React, { useState } from 'react';
import {
  Building2,
  Search,
  Eye,
  Edit2,
  Globe2,
  ShieldCheck,
  Building,
  CheckCircle2,
  MapPin,
  X,
  Plus,
  Upload,
  FileCheck
} from 'lucide-react';
import Modal from '@/components/Modal';
import { initialCompanies } from '@/lib/mock-data';
import { CompanyEntity, CompanyPartner } from '@/lib/types';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyEntity[]>(initialCompanies);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyEntity | null>(null);

  // Edit Form State (Mirrors steel_erp/Companies edit form: comp_name, comp_cr_no, comp_est_id, comp_trade_licence_number, comp_tax_card_no, comp_paid_up_cap, comp_city, comp_country, and partners)
  const [cnameEdit, setCnameEdit] = useState('');
  const [crnoEdit, setCrnoEdit] = useState('');
  const [estidEdit, setEstidEdit] = useState('');
  const [tradeLicenceEdit, setTradeLicenceEdit] = useState('');
  const [taxCardNoEdit, setTaxCardNoEdit] = useState('');
  const [paidUpCapitalEdit, setPaidUpCapitalEdit] = useState('');
  const [cityEdit, setCityEdit] = useState('');
  const [countryEdit, setCountryEdit] = useState('');
  const [partnersEdit, setPartnersEdit] = useState<CompanyPartner[]>([]);

  // Open View Modal (Replicated from steel_erp ViewModal)
  const handleOpenView = (comp: CompanyEntity) => {
    setSelectedCompany(comp);
    setViewModalOpen(true);
  };

  // Open Edit Modal (Replicated from steel_erp EditCompanyModal)
  const handleOpenEdit = (comp: CompanyEntity) => {
    setSelectedCompany(comp);
    setCnameEdit(comp.name);
    setCrnoEdit(comp.crNo);
    setEstidEdit(comp.estId);
    setTradeLicenceEdit(comp.tradeLicenseNo);
    setTaxCardNoEdit(comp.taxCardNo);
    setPaidUpCapitalEdit(String(comp.paidUpCapital));
    setCityEdit(comp.city);
    setCountryEdit(comp.country);
    setPartnersEdit(comp.partners ? JSON.parse(JSON.stringify(comp.partners)) : []);
    setEditModalOpen(true);
  };

  // Partner Handlers in Edit Form
  const handlePartnerChange = (index: number, field: keyof CompanyPartner, value: any) => {
    const updated = [...partnersEdit];
    updated[index] = { ...updated[index], [field]: value };
    setPartnersEdit(updated);
  };

  const handleAddPartner = () => {
    setPartnersEdit([
      ...partnersEdit,
      {
        id: String(Date.now()),
        name: '',
        nationality: '',
        idNumber: '',
        sharePercentage: 0,
        designation: 'Partner'
      }
    ]);
  };

  const handleRemovePartner = (index: number) => {
    setPartnersEdit(partnersEdit.filter((_, i) => i !== index));
  };

  // Save Edit (Mirrors steel_erp update_company handler)
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;

    const updated = companies.map((c) => {
      if (c.id === selectedCompany.id) {
        return {
          ...c,
          name: cnameEdit,
          crNo: crnoEdit,
          estId: estidEdit,
          tradeLicenseNo: tradeLicenceEdit,
          taxCardNo: taxCardNoEdit,
          paidUpCapital: Number(paidUpCapitalEdit) || 0,
          city: cityEdit,
          country: countryEdit,
          partners: partnersEdit
        };
      }
      return c;
    });

    setCompanies(updated);
    setEditModalOpen(false);
    alert(`Company details for "${cnameEdit}" updated successfully!`);
  };

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" /> Companies Management
          </h1>
          <p className="text-xs text-slate-500">
            Multi-entity statutory registry, commercial licenses, capital structure, and legal partner details.
          </p>
        </div>
      </div>

      {/* Multi-Entity Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Entities</span>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">{companies.length} Companies</p>
            <span className="text-[11px] text-blue-600 font-medium">Afri techs Guinea, India & Uk</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Operating Countries</span>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">3 Jurisdictions</p>
            <span className="text-[11px] text-emerald-600 font-medium">Guinea (HQ) • India • Uk</span>
          </div>
        </div>
      </div>

      {/* Main Companies Table (Exact structure as steel_erp companies.php: Sl no, Name, CR No, City, Country, Actions) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              View Companies
            </h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-16 text-center">Sl no</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">CR No</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {companies
                .filter(
                  (c) =>
                    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.crNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.country.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((company, idx) => (
                  <tr key={company.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 text-center text-slate-400 font-semibold">{idx + 1}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <span>{company.name}</span>
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-slate-700">{company.crNo}</td>
                    <td className="px-4 py-3 text-slate-700 font-medium">{company.city}</td>
                    <td className="px-4 py-3 text-slate-600">{company.country}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(company)}
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit Company Details"
                      >
                        <Edit2 className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleOpenView(company)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Company Details"
                      >
                        <Eye className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW MODAL (Replicated directly from steel_erp ViewModal) */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Company Details"
        maxWidth="2xl"
      >
        {selectedCompany && (
          <div className="space-y-5">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-500 w-1/3 bg-slate-50">
                      Company Name
                    </th>
                    <td className="px-4 py-2.5 font-bold text-slate-900">{selectedCompany.name}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-500 bg-slate-50">CR No</th>
                    <td className="px-4 py-2.5 font-mono font-bold text-slate-800">{selectedCompany.crNo}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-500 bg-slate-50">
                      Trade Licence Number
                    </th>
                    <td className="px-4 py-2.5 font-mono text-slate-700">{selectedCompany.tradeLicenseNo}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-500 bg-slate-50">Tax Card No</th>
                    <td className="px-4 py-2.5 font-mono text-slate-700">{selectedCompany.taxCardNo}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-500 bg-slate-50">Paid Up Capital</th>
                    <td className="px-4 py-2.5 font-mono font-bold text-emerald-700">
                      ${selectedCompany.paidUpCapital.toLocaleString()} {selectedCompany.currency}
                    </td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-500 bg-slate-50">City</th>
                    <td className="px-4 py-2.5 text-slate-800 font-medium">{selectedCompany.city}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-500 bg-slate-50">Country</th>
                    <td className="px-4 py-2.5 text-slate-800 font-medium">{selectedCompany.country}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Partner Details (Replicated from steel_erp ViewModal Partner section) */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-800 uppercase">Partner Details</h4>
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">Name</th>
                    <th className="px-4 py-2.5">Nationality</th>
                    <th className="px-4 py-2.5">Passport/QID</th>
                    <th className="px-4 py-2.5">Signature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {selectedCompany.partners && selectedCompany.partners.length > 0 ? (
                    selectedCompany.partners.map((p) => (
                      <tr key={p.id}>
                        <td className="px-4 py-2.5 font-semibold text-slate-900">{p.name}</td>
                        <td className="px-4 py-2.5 text-slate-600">{p.nationality}</td>
                        <td className="px-4 py-2.5 font-mono text-slate-700">
                          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                            {p.idNumber}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <FileCheck className="w-3.5 h-3.5" /> Verified Signature
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-center text-slate-400">
                        No partner details on record.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* EDIT MODAL (Exact replica of steel_erp EditCompanyModal form) */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Company Details"
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveEdit} id="update_company" className="space-y-4">
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <tbody className="divide-y divide-slate-100">
                {/* 1. Company Name */}
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 w-1/3 bg-slate-50">
                    Company Name
                  </th>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      name="comp_name"
                      id="cname_edit"
                      required
                      value={cnameEdit}
                      onChange={(e) => setCnameEdit(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-semibold"
                    />
                  </td>
                </tr>

                {/* 2. CR No */}
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 bg-slate-50">
                    CR No
                  </th>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      name="comp_cr_no"
                      id="crno_edit"
                      required
                      value={crnoEdit}
                      onChange={(e) => setCrnoEdit(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                    />
                  </td>
                </tr>

                {/* 3. Est ID */}
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 bg-slate-50">
                    Est ID
                  </th>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      name="comp_est_id"
                      id="estid_edit"
                      value={estidEdit}
                      onChange={(e) => setEstidEdit(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                    />
                  </td>
                </tr>

                {/* 4. Trade Licence Number */}
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 bg-slate-50">
                    Trade Licence Number
                  </th>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      name="comp_trade_licence_number"
                      id="trade_licence_edit"
                      value={tradeLicenceEdit}
                      onChange={(e) => setTradeLicenceEdit(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                    />
                  </td>
                </tr>

                {/* 5. Tax Card No */}
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 bg-slate-50">
                    Tax Card No
                  </th>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      name="comp_tax_card_no"
                      id="tax_card_no_edit"
                      value={taxCardNoEdit}
                      onChange={(e) => setTaxCardNoEdit(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                    />
                  </td>
                </tr>

                {/* 6. Paid Up Capital */}
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 bg-slate-50">
                    Paid Up Capital
                  </th>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      name="comp_paid_up_cap"
                      id="paid_up_capital_edit"
                      value={paidUpCapitalEdit}
                      onChange={(e) => setPaidUpCapitalEdit(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                    />
                  </td>
                </tr>

                {/* 7. City */}
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 bg-slate-50">
                    City
                  </th>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      name="comp_city"
                      id="city_edit"
                      required
                      value={cityEdit}
                      onChange={(e) => setCityEdit(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </td>
                </tr>

                {/* 8. Country */}
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 bg-slate-50">
                    Country
                  </th>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      name="comp_country"
                      id="country_edit"
                      required
                      value={countryEdit}
                      onChange={(e) => setCountryEdit(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Partner Details (Exact replica of steel_erp EditCompanyModal partner table) */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-bold text-xs text-slate-800 uppercase">Partner Details</h4>
              <button
                type="button"
                onClick={handleAddPartner}
                className="px-2.5 py-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Partner
              </button>
            </div>

            <div className="p-3 space-y-3">
              {partnersEdit.map((partner, pIdx) => (
                <div
                  key={partner.id || pIdx}
                  className="p-3 bg-slate-50/80 border border-slate-200 rounded-lg relative space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">Partner #{pIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePartner(pIdx)}
                      className="text-rose-600 hover:text-rose-800 text-xs font-bold p-1"
                      title="Remove Partner"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                        Name
                      </label>
                      <input
                        type="text"
                        name="part_name[]"
                        value={partner.name}
                        onChange={(e) => handlePartnerChange(pIdx, 'name', e.target.value)}
                        placeholder="Partner full name"
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                        Nationality
                      </label>
                      <input
                        type="text"
                        name="part_nationality[]"
                        value={partner.nationality}
                        onChange={(e) => handlePartnerChange(pIdx, 'nationality', e.target.value)}
                        placeholder="e.g. Guinean, Indian, British"
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                        QID / Passport
                      </label>
                      <input
                        type="text"
                        name="part_qid[]"
                        value={partner.idNumber}
                        onChange={(e) => handlePartnerChange(pIdx, 'idNumber', e.target.value)}
                        placeholder="Passport / ID Number"
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                        Signature Status
                      </label>
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs text-emerald-700">
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Signed & On File</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
            >
              Update
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
