
from xmljson import badgerfish as bf
from xml.etree.ElementTree import fromstring
import json
import sys

if len( sys.argv ) < 2 :
    print 'Usage: urdfjson file_name'

else :

    file_name = sys.argv[1]
    print 'started parsing'
    file_handle = None
    file_content = ''
    try :
        file_handle = open( file_name + '.urdf' )
        file_content = file_handle.read();
        file_handle.close()
    except :
        print 'there was an error reading the file'

    parsed_content = json.dumps( bf.data( fromstring( file_content ) ),
                                 indent=4, sort_keys=True )

    file_handle = open( file_name + '.json', 'w' )
    file_handle.write( parsed_content )
    file_handle.close()
    print 'finished parsing'
