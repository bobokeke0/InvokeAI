import { Collapse, Flex, Grid, GridItem } from '@chakra-ui/react';
import { createMemoizedSelector } from 'app/store/createMemoizedSelector';
import { stateSelector } from 'app/store/store';
import { useAppSelector } from 'app/store/storeHooks';
import DeleteBoardModal from 'features/gallery/components/Boards/DeleteBoardModal';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { memo, useState } from 'react';
import { useListAllBoardsQuery } from 'services/api/endpoints/boards';
import { BoardDTO } from 'services/api/types';
import AddBoardButton from './AddBoardButton';
import BoardsSearch from './BoardsSearch';
import GalleryBoard from './GalleryBoard';
import NoBoardBoard from './NoBoardBoard';

const selector = createMemoizedSelector([stateSelector], ({ gallery }) => {
  const { selectedBoardId, boardSearchText } = gallery;
  return { selectedBoardId, boardSearchText };
});

type Props = {
  isOpen: boolean;
};

const BoardsList = (props: Props) => {
  const { isOpen } = props;
  const { selectedBoardId, boardSearchText } = useAppSelector(selector);
  const { data: boards } = useListAllBoardsQuery();
  const filteredBoards = boardSearchText
    ? boards?.filter((board) =>
        board.board_name.toLowerCase().includes(boardSearchText.toLowerCase())
      )
    : boards;
  const [boardToDelete, setBoardToDelete] = useState<BoardDTO>();

  return (
    <>
      <Collapse in={isOpen} animateOpacity>
        <Flex
          layerStyle="first"
          sx={{
            flexDir: 'column',
            gap: 2,
            p: 2,
            mt: 2,
            borderRadius: 'base',
          }}
        >
          <Flex sx={{ gap: 2, alignItems: 'center' }}>
            <BoardsSearch />
            <AddBoardButton />
          </Flex>
          <OverlayScrollbarsComponent
            defer
            style={{ height: '100%', width: '100%' }}
            options={{
              scrollbars: {
                visibility: 'auto',
                autoHide: 'move',
                autoHideDelay: 1300,
                theme: 'os-theme-dark',
              },
            }}
          >
            <Grid
              className="list-container"
              data-testid="boards-list"
              sx={{
                gridTemplateColumns: `repeat(auto-fill, minmax(108px, 1fr));`,
                maxH: 346,
              }}
            >
              <GridItem sx={{ p: 1.5 }} data-testid="no-board">
                <NoBoardBoard isSelected={selectedBoardId === 'none'} />
              </GridItem>
              {filteredBoards &&
                filteredBoards.map((board, index) => (
                  <GridItem
                    key={board.board_id}
                    sx={{ p: 1.5 }}
                    data-testid={`board-${index}`}
                  >
                    <GalleryBoard
                      board={board}
                      isSelected={selectedBoardId === board.board_id}
                      setBoardToDelete={setBoardToDelete}
                    />
                  </GridItem>
                ))}
            </Grid>
          </OverlayScrollbarsComponent>
        </Flex>
      </Collapse>
      <DeleteBoardModal
        boardToDelete={boardToDelete}
        setBoardToDelete={setBoardToDelete}
      />
    </>
  );
};

export default memo(BoardsList);
