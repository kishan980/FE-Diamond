export const exportToExcelXML = (data: any[]) => {
  const headers = [
    'seqno',
    'ContactPerson',
    'co_city',
    'co_country',
    'phonecountry1',
    'phoneno1',
    'telephone',
    'entityID',
    'user_name',
    'EntityType',
    'emailID1',
    'co_name',
    'co_website',
    'mobileCountry1',
    'mobileno1',
    'contact',
    'IsActive',
    'ActiveID',
    'Type',
    'reqdocs',
    'emailid2',
    'contact2',
    'contactPerson2',
    'address',
    'Faxno',
    'co_zip',
    'notes',
    'CreationDate',
    'AccountCode',
  ];

  const workbookXML = `<?xml version="1.0"?>
  <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
            xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:x="urn:schemas-microsoft-com:office:excel"
            xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
            xmlns:html="http://www.w3.org/TR/REC-html40">
    <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
      <Author>Author</Author>
      <LastAuthor>Last Author</LastAuthor>
      <Created>${new Date().toISOString()}</Created>
    </DocumentProperties>
    <ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel">
      <WindowHeight>13170</WindowHeight>
      <WindowWidth>17580</WindowWidth>
      <WindowTopX>480</WindowTopX>
      <WindowTopY>90</WindowTopY>
      <ProtectStructure>False</ProtectStructure>
      <ProtectWindows>False</ProtectWindows>
    </ExcelWorkbook>
    <Styles>
      <Style ss:ID="Default" ss:Name="Normal">
        <Alignment ss:Vertical="Bottom"/>
        <Borders/>
        <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#000000"/>
        <Interior/>
        <NumberFormat/>
        <Protection/>
      </Style>
    </Styles>
    <Worksheet ss:Name="Sheet1">
      <Table>
        <Row>
          ${headers.map((header) => `<Cell><Data ss:Type="String">${header}</Data></Cell>`).join('')}
        </Row>
        ${data
          .map(
            (item) => `
        <Row>
          ${headers.map((header) => `<Cell><Data ss:Type="String">${item[header] || ''}</Data></Cell>`).join('')}
        </Row>`
          )
          .join('')}
      </Table>
      <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
        <Selected/>
        <Panes>
          <Pane>
            <Number>3</Number>
            <ActiveRow>1</ActiveRow>
          </Pane>
        </Panes>
        <ProtectObjects>False</ProtectObjects>
        <ProtectScenarios>False</ProtectScenarios>
      </WorksheetOptions>
    </Worksheet>
  </Workbook>`;

  return workbookXML;
};
