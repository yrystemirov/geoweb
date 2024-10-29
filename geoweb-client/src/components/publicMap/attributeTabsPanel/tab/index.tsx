import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';

import { debounceTime, Subject } from 'rxjs';

import {
  Paper,
  TablePagination,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  CircularProgress,
} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import UploadFileIcon from '@mui/icons-material/UploadFile';

//import { drawLayerObjOnMap } from '../../../mapTools/LayerFN';
import VectorLayer from 'ol/layer/Vector';
import { toast } from 'react-toastify';
import VectorSource from 'ol/source/Vector';
import { usePublicMapStore } from '../../../../hooks/usePublicMapStore';
import { mapOpenAPI } from '../../../../api/openApi';
import OpenlayersBaseLayersUtils from '../../../../utils/openlayers/OpenlayersBaseLayersUtils';
//import ExportFileDialog from '../../leftPanel/layersTab/workingLayers/exportFileDialog';

export const AttributeTableTab = (props: any) => {
  const { map } = usePublicMapStore();
  const { layer } = props;

  const [attrList, setAttrList] = useState<any[]>([]);
  const [attrFilterList, setAttrFilterList] = useState<any[]>([]);
  const [attrs, setAttrs] = useState<any[]>([]);
  const [displayedColumns, setDisplayedColumns] = useState<any[]>([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const hiddenFileInput = useRef(null);
  const [currentUploadLayerGid, setCurrentUploadLayerGid] = useState<any | null>(null);
  const [uploadDialog, setUploadDialog] = useState(false);

  /*
  const handleInputFileChange = async (event: any) => {
    const fileUploaded = event.target.files[0];
    let formData = new FormData();
    formData.append('files', fileUploaded, fileUploaded.name || '');
    try {
      const uploadedFiles = await api.post('uploads/main/files/upload', formData);
      if (uploadedFiles && uploadedFiles.data && uploadedFiles.data.length > 0) {
        let uploadedFileData = uploadedFiles.data[0];
        api
          .post(`${gisApi}/feature-files/add`, {
            layerGid: currentUploadLayerGid,
            fileName: uploadedFileData.originalname,
            minioBucket: uploadedFileData.bucket,
            minioObject: uploadedFileData.filename,
          })
          .then((response) => {
            toast.success(t('common:common.file_uploaded_successfully'));
            setCurrentUploadLayerGid(null);
            //@ts-ignore
            hiddenFileInput.current.value = '';
          })
          .catch((error) => {
            //@ts-ignore
            hiddenFileInput.current.value = '';
            toast.error(t('gis:gis.error_loading'));
          });
      } else {
        //@ts-ignore
        hiddenFileInput.current.value = '';
        toast.error(t('gis:gis.error_loading'));
      }
    } catch (e: any) {
      //@ts-ignore
      hiddenFileInput.current.value = '';
      toast.error(e.message);
    }
  };

  const tryToOpenFile = (layerGid: any) => {
    api
      .get(`${gisApi}/feature-files/layerGid/${layerGid}`)
      .then((response) => {
        if (response.data.length > 0) {
          let lastFile = response.data[response.data.length - 1];
          api
            .get(`uploads/main/files/download?bucket=${lastFile.minioBucket}&filename=${lastFile.minioObject}`, {
              responseType: 'blob',
            })
            .then((res) => {
              const file = new Blob([res.data], { type: 'application/pdf' });
              //Build a URL from the file
              const fileURL = URL.createObjectURL(file);
              //Open the URL on new Window
              const pdfWindow = window.open();
              //@ts-ignore
              pdfWindow.location.href = fileURL;
            })
            .catch((error) => {
              console.log('gis api error', error);
              setIsLoading(false);
            });
        } else {
          toast.error(t('gis:gis.no_files_found_specified_object'));
        }
      })
      .catch((error) => {
        toast.error(t('gis:gis.error_loading'));
      });
  };
*/
  useEffect(() => {
    setPage(0);
    setAttrs([]);
    setDisplayedColumns([]);
    if (layer) {
      mapOpenAPI
        .getOpenApiLayerAttribtes(layer.id)
        .then((response) => {
          const _attrs: any[] = response.data.filter((x: any) => x.attrname !== 'gid');
          setAttrs(_attrs);
          const _displayedColumns = _attrs.map((x) => x.attrname);
          setDisplayedColumns(_displayedColumns);
        })
        .catch((error) => {
          console.log('error layers attrs', error);
          setPage(0);
          setAttrs([]);
          setDisplayedColumns([]);
        });
    }
  }, [layer]);

  useEffect(() => {
    if (displayedColumns && displayedColumns.length > 0) getAttributes();
  }, [displayedColumns, page]);

  const getAttributes = () => {
    const filter = {
      layerId: layer.id,
      criteria: '',
      layerName: layer.layername,
      limit: rowsPerPage,
      offset: page * rowsPerPage,
      gid: 0,
      attributes: [],
      orderByColumn: 'gid',
      criteriaParam: [],
    };
    setAttrList([]);
    mapOpenAPI
      .getOpenApiLayerFeatures(layer.layername, page, rowsPerPage)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          if (response.data && response.data.content) {
            setTotal(response.data.totalElements);
            setAttrList(response.data.content);
            setAttrFilterList(response.data.content);
          }
        }
      })
      .catch((error) => {
        console.log('gis api error', error);
      });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleExportExcel = () => {};

  // search
  const searchSubject = new Subject();
  searchSubject
    .asObservable()
    .pipe(debounceTime(1000))
    .subscribe((data: any) => {
      let _search = data.trim(); // Remove whitespace
      _search = _search.toLowerCase();
      if (_search.length > 1) {
        const filterData: any[] = [];
        attrList.forEach((item) => {
          const dlist = _search.split(' ').every((word: any) => {
            return displayedColumns.some((property) => `${item[property]}`.toLowerCase().includes(word));
          });
          if (dlist) {
            filterData.push(item);
          }
        });

        setAttrList(filterData);
      } else {
        setAttrList(attrFilterList);
      }
    });

  const handleSearch = (event: any) => {
    searchSubject.next(event.target.value);
  };

  const zoomToObject = (item: any) => {
    const attrTableVectorName = 'attributePanelVectorLayer';
    let layerExists =
      map!
        .getLayers()
        .getArray()
        .filter((layer_: any) => {
          return layer_.getProperties()?.code == attrTableVectorName;
        }).length > 0;
    let vector = new VectorLayer();
    if (layerExists) {
      vector = map!
        .getLayers()
        .getArray()
        .filter((layer_: any) => {
          return layer_.getProperties()?.code == attrTableVectorName;
        })[0] as VectorLayer<VectorSource>;
    } else {
      vector = OpenlayersBaseLayersUtils.getDefaultVectorLayer(true, attrTableVectorName);
      map?.addLayer(vector);
      map?.updateSize();
    }
    vector.getSource()?.clear();

    //drawLayerObjOnMap(map!, item.gid, layer.layername, vector, t);
  };
  const handleRowDoubleClick = (item: any) => {
    zoomToObject(item);
  };

  const loading = () => {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  };

  const clickExportExcel = () => {
    setUploadDialog(true);
  };

  const handleCloseDialog = () => {
    setUploadDialog(false);
  };

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden', zIndex: 500000 }}>
        {/* <input
          type="file"
          onChange={handleInputFileChange}
          ref={hiddenFileInput}
          style={{ display: 'none' }}
          accept="application/pdf"
        /> */}
        <div className="attr-table-filter">
          <div className="attr-table-pagination">
            {/* <TablePagination
              align="left"
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ display: 'flex' }}
              //labelRowsPerPage={t('gis:gis.numberLinesPerPage')}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
            /> */}
          </div>
          {/* <div style={{ display: 'flex' }}>
            <div style={{ color: 'darkslateblue', marginRight: '18px', cursor: 'pointer' }} title="экспорт файла">
              <CloudDownloadIcon onClick={clickExportExcel}></CloudDownloadIcon>
            </div>
            <input placeholder="Поиск" className="inp-search" onKeyUp={handleSearch} />
          </div> */}
        </div>
        <TableContainer sx={{ minHeight: '182px', height: 'calc(100% - 50px)' }}>
          <Table stickyHeader size="small" aria-label="sticky table">
            <TableHead>
              <TableRow>
                {attrs.map((column) => (
                  <TableCell
                    key={column.id}
                    // align={column.align}
                    // style={{minWidth: column.minWidth}}
                  >
                    {column.nameRu}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className="skjdfhkjshfhsdkjf">
              {attrList.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.gid}>
                    {displayedColumns.map((column) => {
                      const value = row[column];
                      return (
                        <TableCell key={column} align="left" onDoubleClick={() => handleRowDoubleClick(row)}>
                          {column.format && typeof value === 'number' ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* {uploadDialog && (
                <ExportFileDialog
                    show={uploadDialog}
                    layer={layer}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onClose={handleCloseDialog}
                />
            )} */}
    </>
  );
};
